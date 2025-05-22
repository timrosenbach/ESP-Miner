#ifndef MINING_OPERATIONS_H
#define MINING_OPERATIONS_H

#include "global_state.h"
#include "esp_err.h"

/**
 * @brief Initializes queues, ASIC, and starts all mining-related tasks.
 *
 * This function will:
 * 1. Initialize stratum_queue and ASIC_jobs_queue if they are not already created.
 * 2. Initialize the ASIC (call ASIC_init, set baud rate, clear buffer) if not already initialized.
 *    Sets state->ASIC_initalized to true on success.
 * 3. Create stratum_task, create_jobs_task, ASIC_task, ASIC_result_task, and statistics_task
 *    if their respective handles in GlobalState are NULL.
 * 4. Sets state->mining_disabled to false upon successful completion.
 *
 * @param state Pointer to the GlobalState struct.
 * @return ESP_OK on success, ESP_FAIL if ASIC initialization fails or a critical error occurs.
 */
esp_err_t start_mining_processes(GlobalState *state);

#endif // MINING_OPERATIONS_H
