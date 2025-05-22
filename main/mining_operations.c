#include "mining_operations.h"
#include "esp_log.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

#include "stratum_task.h"
#include "create_jobs_task.h"
#include "asic_task.h"
#include "asic_result_task.h"
#include "statistics_task.h"
#include "asic.h"
#include "serial.h"

static const char *TAG = "mining_ops";

esp_err_t start_mining_processes(GlobalState *state) {
    ESP_LOGI(TAG, "Attempting to start mining processes...");

    // 1. Initialize queues if not already initialized
    queue_init(&state->stratum_queue);
    queue_init(&state->ASIC_jobs_queue);
    
    // 2. Initialize ASIC if not already initialized
    if (!state->ASIC_initalized) {
        ESP_LOGI(TAG, "Initializing ASIC...");
        if (ASIC_init(state) == 0) {
            state->SYSTEM_MODULE.asic_status = "Chip count 0";
            ESP_LOGE(TAG, "ASIC_init failed (chip count 0). Mining cannot start.");
            state->ASIC_initalized = false;
            return ESP_FAIL;
        }
        SERIAL_set_baud(ASIC_set_max_baud(state));
        SERIAL_clear_buffer();
        state->ASIC_initalized = true;
        ESP_LOGI(TAG, "ASIC initialized successfully.");
    } else {
        ESP_LOGI(TAG, "ASIC already initialized.");
    }

    // 3. Create mining tasks if they are not already running (handles are NULL)
    if (state->stratum_task_handle == NULL) {
        if (xTaskCreate(stratum_task, "stratum admin", 8192, (void *)state, 5, &state->stratum_task_handle) != pdPASS) {
            ESP_LOGE(TAG, "Failed to create stratum_task.");
        } else {
            ESP_LOGI(TAG, "stratum_task created/verified.");
        }
    }

    if (state->create_jobs_task_handle == NULL) {
        if (xTaskCreate(create_jobs_task, "stratum miner", 8192, (void *)state, 10, &state->create_jobs_task_handle) != pdPASS) {
            ESP_LOGE(TAG, "Failed to create create_jobs_task.");
        } else {
            ESP_LOGI(TAG, "create_jobs_task created/verified.");
        }
    }

    if (state->asic_task_handle == NULL) {
        if (xTaskCreate(ASIC_task, "asic", 8192, (void *)state, 10, &state->asic_task_handle) != pdPASS) {
            ESP_LOGE(TAG, "Failed to create asic_task.");
        } else {
            ESP_LOGI(TAG, "asic_task created/verified.");
        }
    }

    if (state->asic_result_task_handle == NULL) {
        if (xTaskCreate(ASIC_result_task, "asic result", 8192, (void *)state, 15, &state->asic_result_task_handle) != pdPASS) {
            ESP_LOGE(TAG, "Failed to create asic_result_task.");
        } else {
            ESP_LOGI(TAG, "asic_result_task created/verified.");
        }
    }

    if (state->statistics_task_handle == NULL) {
        if (xTaskCreate(statistics_task, "statistics", 8192, (void *)state, 3, &state->statistics_task_handle) != pdPASS) {
            ESP_LOGE(TAG, "Failed to create statistics_task.");
        } else {
            ESP_LOGI(TAG, "statistics_task created/verified.");
        }
    }
    
    state->mining_disabled = false;
    ESP_LOGI(TAG, "Mining processes started/verified successfully.");
    return ESP_OK;
}
