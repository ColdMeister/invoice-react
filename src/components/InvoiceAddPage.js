import React, { Component } from 'react';
//import {CountryService} from '../service/CountryService';
import {InputText} from 'primereact/inputtext';
//import {InputTextarea} from 'primereact/inputtextarea';
import {Messages} from 'primereact/messages';
//import {Message} from 'primereact/message';
import {Growl} from 'primereact/growl';
//import {AutoComplete} from 'primereact/autocomplete';
//import {MultiSelect} from 'primereact/multiselect';
//import {Calendar} from 'primereact/calendar';
//import {Chips} from 'primereact/chips';
//import {Checkbox} from 'primereact/checkbox';
//import {RadioButton} from 'primereact/radiobutton';
//import {InputSwitch} from 'primereact/inputswitch';
//import {Dropdown} from 'primereact/dropdown';
//import {Password} from 'primereact/password';
//import {Spinner} from 'primereact/spinner';
//import {Slider} from 'primereact/components/slider/Slider';
//import {ListBox} from 'primereact/listbox';
//import {Rating} from 'primereact/rating';
//import {ColorPicker} from 'primereact/colorpicker';
//import {Editor} from 'primereact/editor';
//import {ToggleButton} from 'primereact/togglebutton';
//import {SelectButton} from 'primereact/selectbutton';
import {Button} from 'primereact/button';
//import {SplitButton} from 'primereact/splitbutton';
import $ from 'jquery';
import axios from 'axios';


export class InvoiceAddPage extends Component {

  constructor(props){
       super(props);
       this.state = {
         campInvoiceName: "",
         campCompanyName:"",
         campAddress:"",
         campPhone:"",
         campTotal:""
       }

       this.sendSave = this.sendSave.bind(this);

  }

  render() {
        return (
          <div>
            <Messages ref={(el) => this.messages = el} />
            <Growl ref={(el) => this.growl = el} style={{marginTop: '75px'}} />
              <div className="p-fluid">
                  <div className="p-field">
                      <label htmlFor="invoice_name">Invoice Name</label>
                      <InputText id="invoice_name" type="text" value={this.state.campInvoiceName} onChange={(value)=> this.setState({campInvoiceName:value.target.value})}/>
                  </div>
                  <div className="p-field">
                      <label htmlFor="company_name">Company Name</label>
                      <InputText id="company_name" type="text" value={this.state.campCompanyName} onChange={(value)=> this.setState({campCompanyName:value.target.value})}/>
                  </div>
                  <div className="p-field">
                      <label htmlFor="address">Address</label>
                      <InputText id="address" type="text" value={this.state.campAddress} onChange={(value)=> this.setState({campAddress:value.target.value})}/>
                  </div>
                  <div className="p-field">
                      <label htmlFor="phone">Phone</label>
                      <InputText id="phone" type="text" value={this.state.campPhone} onChange={(value)=> this.setState({campPhone:value.target.value})}/>
                  </div>
                  <div className="p-field">
                      <label htmlFor="total">Total</label>
                      <InputText id="total" type="text" value={this.state.campTotal} onChange={(value)=> this.setState({campTotal:value.target.value})}/>
                  </div>
              </div><br/><b>Invoice Details</b><br/><br/>
              <div id="container">
                <div className="p-fluid p-formgrid p-grid">
                    <div className="p-field p-col">
                        <label htmlFor="item_id1">Item id</label>
                        <InputText id="item_id1" type="text"/>
                    </div>
                    <div className="p-field p-col">
                        <label htmlFor="item_name1">Item Name</label>
                        <InputText id="item_name1" type="text"/>
                    </div>
                    <div className="p-field p-col">
                        <label htmlFor="qty1">Quantity</label>
                        <InputText id="qty1" type="text"/>
                    </div>
                    <div className="p-field p-col">
                        <label htmlFor="amount1">Amount</label>
                        <InputText id="amount1" type="text"/>
                    </div>
                </div>

                <div className="p-fluid p-formgrid p-grid">
                    <div className="p-field p-col">
                        <label htmlFor="item_id2">Item id</label>
                        <InputText id="item_id2" type="text"/>
                    </div>
                    <div className="p-field p-col">
                        <label htmlFor="item_name2">Item Name</label>
                        <InputText id="item_name2" type="text"/>
                    </div>
                    <div className="p-field p-col">
                        <label htmlFor="qty2">Quantity</label>
                        <InputText id="qty2" type="text"/>
                    </div>
                    <div className="p-field p-col">
                        <label htmlFor="amount2">Amount</label>
                        <InputText id="amount2" type="text"/>
                    </div>
                </div>
                  <Button label="Add Invoice"  onClick={()=>this.sendSave()}/>
              </div>
          </div>

        );
    }

    sendSave(){
      const baseUrl = "http://localhost:3000/invoice/create";

      var no_of_input_text = $('#container').find('input[type="text"]').length  - 6;

      var arr = [];

      for (var i = 1; i <= no_of_input_text; i++){
        var item_id     = $("#item_id"+i).val();
        var item_name   = $("#item_name"+i).val();
        var qty         = $("#qty"+i).val();
        var amount      = $("#amount"+i).val();

        if(item_id !== ''){
          arr.push({item_id:item_id, item_name:item_name,quantity:qty, amount:amount});
        }
      }

      const datapost = {
        invoice_name : this.state.campInvoiceName,
        company_name : this.state.campCompanyName,
        address : this.state.campAddress,
        phone : this.state.campPhone,
        total  : this.state.campTotal,
        itemdetails: arr
      }


      axios.post(baseUrl,datapost)
      .then(response=>{
        if (response.data.success===true) {
          //alert(response.data.message)
          let msg = {severity: 'success', summary: 'Success', detail: 'Adding Invoice'};
          this.messages.show(msg);
          setTimeout(
              function() {
                  window.location.reload(false);
              },
              2000
          );
        }
        else {
          //alert(response.data.message)
          let msg = {severity: 'error', summary: 'Error', detail: 'Adding Invoice failed'};
          this.messages.show(msg);
        }
      }).catch(error=>{
        alert("Error 34 "+error)
      })
    }
}
export default InvoiceAddPage;
