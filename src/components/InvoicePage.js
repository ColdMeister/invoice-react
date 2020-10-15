import React, { Component } from 'react';
import {InvoiceService} from '../service/InvoiceService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Link } from "react-router-dom";
import axios from 'axios';

//sweetalert2
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';


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

      const message = () => {
       //alert("Hello World!");
       Swal.fire({
         title: 'Are you sure?',
         text: 'You will not be able to recover this datae!',
         type: 'warning',
         showCancelButton: true,
         confirmButtonText: 'Yes, delete it!',
         cancelButtonText: 'No, keep it'
       }).then((result) => {
         if (result.value) {
           // url de backend
           const baseUrl = "http://localhost:3000/invoice/delete"    // parameter data post
           // network
           axios.post(baseUrl,{
             id:rowData.id
           })
           .then(response =>{
             if (response.data.success) {
               Swal.fire(
                 'Deleted!',
                 'Your invoice has been deleted.',
                 'success'
               )
               window.setTimeout(function(){
                 window.location.reload();
               } ,3000);
             }

           })
           .catch ( error => {
             alert("Error 325 ")
           })
         } else if (result.dismiss === Swal.DismissReason.cancel) {
           Swal.fire(
             'Cancelled',
             'Your data is safe :)',
             'error'
           )
         }
       })
      }


        return (

            <>
                <Link to={"/invoice_edit/"+rowData.id}><Button label="Edit" /></Link>
                &nbsp;&nbsp;
                <Button  label="Delete" className="p-button-danger" onClick={message} />
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
