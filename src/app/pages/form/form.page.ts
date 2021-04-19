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
    public validation: IFormValidation = {
        isValid: true,
        errors: []
    };

    public onSetErrorClick(event: Event): void {
        event.stopPropagation();
        event.preventDefault();

        this.setError();
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
}