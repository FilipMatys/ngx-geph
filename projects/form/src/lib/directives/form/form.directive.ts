// External modules
import { AfterContentInit, ContentChild, ContentChildren, Directive, HostBinding, Input, OnDestroy, QueryList, TemplateRef } from "@angular/core";
import { Subscription } from "rxjs";

// Interfaces
import { IFormValidation } from "../../interfaces/validation.interface";
import { IFormMessage } from "../../interfaces/message.interface";

// Directives
import { FormInputDirective } from "../input/input.directive";
import { FormMessageDirective } from "../message/message.directive";

// Outlets
import { FormMessagesOutletDirective } from "../../outlets/messages/messages.outlet";

@Directive({ selector: "[ngxForm]" })
export class FormDirective implements AfterContentInit, OnDestroy {

    @HostBinding("class.ngx-form")
    public hasDefaultClass: boolean = true;

    // Inputs change subscription
    public inputsChangeSubscription: Subscription;

    @Input("ngxForm")
    public set validation(value: IFormValidation) {
        // Assign validation
        this._validation = value;

        // Process validation change
        this.processValidationChange();
    }

    @HostBinding("class.ngx-form--valid")
    public get isValid(): boolean {
        // Return validation flag
        return this._validation && this._validation.isValid;
    }

    @HostBinding("class.ngx-form--invalid")
    public get isInvalid(): boolean {
        // Return validation flag
        return this._validation && !this._validation.isValid;
    }

    // List of inputs
    @ContentChildren(FormInputDirective, { descendants: true })
    public inputs: QueryList<FormInputDirective>;

    // List of outlets
    @ContentChildren(FormMessagesOutletDirective, { descendants: true })
    public outlets: QueryList<FormMessagesOutletDirective>;

    // Message template
    @ContentChild(FormMessageDirective, { read: TemplateRef })
    public messageTemplate: TemplateRef<HTMLElement>;

    // Form validation
    private _validation: IFormValidation;

    /**
     * After content init hook
     */
    public ngAfterContentInit(): void {
        // Make first validation processing
        this.processValidationChange();

        // Subscribe to inputs change
        this.inputsChangeSubscription = this.inputs.changes.subscribe(() => this.processValidationChange());
    }

    /**
     * On destroy hook
     */
    public ngOnDestroy(): void {
        // Unsubscribe
        this.inputsChangeSubscription && this.inputsChangeSubscription.unsubscribe();
    }

    /**
     * Process validation change
     */
    private async processValidationChange(): Promise<void> {
        // Make sure inputs and message template are set
        if (!this.inputs || !this.messageTemplate) {
            // Nothing to do
            return;
        }

        // Init grouped errors by id
        const gErrors: { [id: string]: IFormMessage[] } = {};

        // Group errors
        (this._validation.errors || []).forEach((message) => gErrors[message.id] ? gErrors[message.id].push(message) : gErrors[message.id] = [message]);

        // Now process inputs and set 
        this.inputs.forEach((input) => input.isValid = !this._validation ? null : !(gErrors[input.identifier] || []).length);

        // Now process outlets
        this.outlets.forEach((outlet) => {
            // Clear outlet
            outlet.viewContainerRef.clear();

            // Create view for each message
            (gErrors[outlet.identifier] || []).forEach((message) => outlet.viewContainerRef.createEmbeddedView<any>(this.messageTemplate, { $implicit: message }));
        });
    }
}