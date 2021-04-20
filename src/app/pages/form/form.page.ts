// External modules
import { Component } from "@angular/core";

// Component
import { IFormValidation } from "form";

@Component({
    selector: "page-form",
    templateUrl: "./form.page.html",
    styleUrls: ["./form.page.scss"]
})
export class FormPage {

    // Init validation
    public validation: IFormValidation = {};

    public onSetErrorClick(event: Event): void {
        event.stopPropagation();
        event.preventDefault();

        this.setError();
    }

    public onSetSuccessClick(event: Event): void {
        event.stopPropagation();
        event.preventDefault();

        this.setSuccess();
    }

    /**
     * Set error
     */
    private setError(): void {
        this.validation = {
            isValid: false,
            errors: [
                { id: "name", text: "Not valid value, mate!" },
                { id: "password", text: "Please, fill the password with proper one." },
            ]
        };
    }

    /**
     * Set success
     */
    private setSuccess(): void {
        this.validation = { isValid: true };
    }
}