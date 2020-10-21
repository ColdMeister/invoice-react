import React, { useContext, useState, useEffect, useRef } from 'react';
//import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Table, Input, Button, Popconfirm, Form } from 'antd';
import axios from 'axios';

const EditableContext = React.createContext();

const baseUrl = "http://localhost:3000";

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef();
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async (e) => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

export class InvoiceEditPage extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: 'item_id',
        dataIndex: 'item_id',
        width: '20%',
        editable: true,
      },
      {
        title: 'Item name',
        dataIndex: 'item_name',
      },
      {
        title: 'Quantity',
        dataIndex: 'quantity',
      },
      {
        title: 'Amount',
        dataIndex: 'amount',
      },
      {
        title: 'Action',
        dataIndex: 'action',
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
              <a href="#/">Delete</a>
            </Popconfirm>
          ) : null,
      },
    ];


    this.state = {
      dataSource: [],
      count: "",
    };

   }


  handleDelete = (key) => {
    const dataSource = [...this.state.dataSource];
    this.setState({
      dataSource: dataSource.filter((item) => item.key !== key),
    });
  };
  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      item_id: '0006',
      item_name: `akuku(${count})`,
      quantity: 2,
      amount: 100,
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  };
  handleSave = (row) => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    this.setState({
      dataSource: newData,
    });
  };

  componentDidMount(){
      let invoiceId = this.props.match.params.id;
      //alert(invoiceId);

      const url = baseUrl+"/invoice/get/"+invoiceId;
      console.log(url);
      axios.get(url)
      .then(res=>{
        if (res.data.success) {
          const data = res.data.data[0];
          const invdetails = data.InvoiceDetails;

          const count = Object.keys(data.InvoiceDetails).length;

          var newState = [...invdetails];
          newState.forEach(function(i,index) {
            i.key = index;
          })
          this.setState({dataSource: newState,count: count});

          this.setState({
            dataInvoice:data,
            campInvoiceName:data.invoice_name,
            campCompanyName:data.company_name,
            campAddress:data.address,
            campPhone:data.phone,
            campTotal:data.total
          })

          console.log(this.state.campInvoiceName);


        }else {
          alert("Error web service")
        }
      })
      .catch(error=>{
        alert("Error server "+error)
      })
  }

  render() {

    var { dataSource } = this.state;
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }

      return {
        ...col,
        onCell: (record) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div>
        <Button
          onClick={this.handleAdd}
          type="primary"
          style={{
            marginBottom: 16,
          }}
        >
          Add a row
        </Button>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
        />
      </div>
    );
  }
}

export default InvoiceEditPage;
