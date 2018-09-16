export class ModalService {
    private modals: any[] = [];
    private openModal: any;

    add(modal: any) {
        this.modals.push(modal);
    }

    remove(id: string) {
        this.modals = this.modals.filter(x => x.id !== id);
    }

    open(id: string) {
        let modal: any = this.modals.filter(x => x.id === id)[0];
        this.openModal = modal;
        modal.open();
    }

    close(id: string) {
        if (id === "") {
            this.openModal.close();
            this.openModal = null;
        } else {
            let modal: any = this.modals.filter(x => x.id === id)[0];
            modal.close();
        }
    }
}