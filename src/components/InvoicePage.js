import React, { Component } from 'react';
import {InvoiceService} from '../service/InvoiceService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Link } from "react-router-dom";


export class InvoicePage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            dataTableValue: []
        };

        this.invoiceService = new InvoiceService();

    }

    componentDidMount() {
        this.invoiceService.getInvoiceList().then(data => this.setState({dataTableValue: data}));
    }

    actionBodyTemplate(rowData) {
        return (

            <>
                <Link to={"/invoice_edit/"+rowData.id}><Button label="Edit" /></Link>
                &nbsp;&nbsp;
                <Button label="Delete" className="p-button-danger" />
            </>
        );

   }

    render() {
        const paginatorLeft = <Button type="button" icon="pi pi-refresh" className="p-button-text" />;
        const paginatorRight = <Button type="button" icon="pi pi-cloud" className="p-button-text" />;

        return (
            <div>
              <div><Link to={"/invoice_add/"}><Button label="Add Invoice" /></Link></div><br/>
                <div className="card">
                    <DataTable value={this.state.dataTableValue} paginator
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={10} rowsPerPageOptions={[10,20,50]}
                        paginatorLeft={paginatorLeft} paginatorRight={paginatorRight} editMode="row">
                        <Column field="id" header="Id"></Column>
                        <Column field="invoice_name" header="Invoice Name"></Column>
                        <Column field="company_name" header="Company Name"></Column>
                        <Column field="address" header="Address"></Column>
                        <Column field="total" header="Total Amount"></Column>
                        <Column  headerStyle={{ width: '14rem' }} bodyStyle={{ textAlign: 'center' }} header="Action" body={this.actionBodyTemplate}></Column>
                    </DataTable>
                </div>

            </div>

        );
    }


}
