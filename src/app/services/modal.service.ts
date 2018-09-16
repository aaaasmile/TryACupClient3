export class ModalService {
    private modals: any[] = [];
    private openModal: any;

    add(modal: any) {
        // add modal to array of active modals
        this.modals.push(modal);
    }

    remove(id: string) {
        // remove modal from array of active modals
        this.modals = this.modals.filter(x => x.id !== id);
    }

    open(id: string) {
        // open modal specified by id
        let modal: any = this.modals.filter(x => x.id === id)[0];
        this.openModal = modal;
        modal.open();
    }

    close(id: string) {
        // close modal specified by id
        if (id === "") {
            this.openModal.close();
            this.openModal = null;
        } else {
            let modal: any = this.modals.filter(x => x.id === id)[0];
            modal.close();
        }
    }
}