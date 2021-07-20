import Swal from "sweetalert2";

export const alertPopup = (title, html, confirmLabel, confirmAction, cancelLabel = 'Dismiss') => {
    Swal.fire({
            title,
            html,
            icon: 'question',
            iconHtml: '!',
            showCancelButton: true,
            cancelButtonText: cancelLabel,
            width: '400px',
            reverseButtons: true,
            customClass: {
                container: 'swal-wrapper',
                title: 'swal-title',
                icon: 'swal-icon',
                content: 'swal-body',
                confirmButton: 'swal-confirm',
                cancelButton: 'swal-cancel',
            }
        }
    ).then((result) => {
        if (result.isConfirmed) {
            confirmAction();
        } else if (result.isDenied) {
            // maybe add a handler here?
        }
    })
};

export const needsLogin = (msg = null) => {
    const defaultMessage = "Please login in order to build your schedule and add activities during the event";

    alertPopup('Login', msg || defaultMessage, 'Login', console.log );
};