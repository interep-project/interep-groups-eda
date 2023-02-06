import { join } from 'path'

export const SAMPLE_SIZE = 1000
export const DATA_DIR = join(__dirname, '..', '..', 'data')

// found by manual binary search as of 3/2/23, assuming ID is an integer increased by 1 upon each new user registration
export const GH_USER_MAX_ID = 124_369_989
