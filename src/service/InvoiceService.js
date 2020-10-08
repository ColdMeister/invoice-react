import axios from 'axios';

export class InvoiceService {

    getInvoiceList() {
        return axios.get('http://localhost:3000/invoice/list')
                .then(res => res.data.data);
    }

}
