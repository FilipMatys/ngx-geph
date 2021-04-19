// Interfaces
import { IFormMessage } from "./message.interface";

/**
 * Form validation
 * @description Interface for form validation
 */
export interface IFormValidation {
    isValid?: boolean;
    errors?: IFormMessage[];
}