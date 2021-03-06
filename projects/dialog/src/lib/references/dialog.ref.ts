import { Observable, Subject } from "rxjs";

/**
 * Dialog reference
 */
export class DialogRef<TComponent, TResult = any> {

    // Component instance
    public componentInstance: TComponent;

    // Event sources
    private readonly afterOpenedSource: Subject<void> = new Subject<void>();
    private readonly beforeClosedSource: Subject<TResult | undefined> = new Subject<TResult | undefined>();
    private readonly afterClosedSource: Subject<TResult | undefined> = new Subject<TResult | undefined>();

    /**
     * Close dialog
     * @param result 
     */
    public close(result?: TResult): void {

    }

    /**
     * After opened
     * @description Observable notified after the
     * dialog was opened
     */
    public afterOpened(): Observable<void> {
        return this.afterOpenedSource.asObservable();
    }

    /**
     * Before closed
     * @description Observable notified before
     * the dialog was closed
     */
    public beforeClosed(): Observable<TResult | undefined> {
        return this.beforeClosedSource.asObservable();
    }

    /**
     * After closed
     * @description Observable notified after the
     * dialog was closed
     */
    public afterClosed(): Observable<TResult | undefined> {
        return this.afterClosedSource.asObservable();
    }
}