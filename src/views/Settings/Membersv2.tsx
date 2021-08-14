import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Avatar, Button, Table, Radio, Divider } from "antd";
import {CardComponent, CardNumber, CardExpiry, CardCVV} from "@chargebee/chargebee-js-react-wrapper";

// import { ChargeBee, _hosted_page } from "chargebee-typescript";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Member's Email",
    dataIndex: "email",
  },
  {
    title: "Invitation Sent On",
    dataIndex: "invitation_date",
  },
  {
    title: "Account Status",
    dataIndex: "account_status",
  },
  {
    title: "Plan Type",
    dataIndex: "subscription_plan",
  },
  {
    title: "Actions",
    dataIndex: "actions",
  },
];

const data: object[] = [];
for (let i = 1; i < 30; i++) {
  data.push({
    key: i,
    name: `Edward King ${i}`,
    email: "king@hooli.xyz",
    invitation_date: `Jul ${i}, 2021`,
    account_status: "Active",
    subscription_plan: "Flex Starter",
    actions: "",
  });
}


class Membersv2 extends React.Component {
  // https://stackoverflow.com/a/57467537/950462
  private cardRef: React.RefObject<any>;

  constructor(props) {
    super(props);
    this.cardRef = React.createRef();
  }

  state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
    // To hold validation error messages
    errorMessage: "",
    errors: {},
    // Options for card component
    options: {
      // Custom classes - applied on container elements based on field's state
      classes: {
        focus: 'focus',
        invalid: 'invalid',
        empty: 'empty',
        complete: 'complete',
      },

      style: {
        base: {
          color: '#2a2d5b',
          fontWeight: '500',
          fontFamily: 'Raleway,-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, sans-serif',
          fontSize: '16px',
          fontSmoothing: 'antialiased',

          ':focus': {
            // color: '#424770',
          },

          '::placeholder': {
            color: '#9293AB',
            fontSize: '14px',
          },

          ':focus::placeholder': {
            color: '#666',
          },
        },
        invalid: {
          color: '#e41029',

          ':focus': {
            color: '#e44d5f',
          },
          '::placeholder': {
            color: '#FFCCA5',
          },
        },
      },

      // locale
      locale: 'en',

      // Custom fonts
      fonts: [
        'https://fonts.googleapis.com/css?family=Raleway:300,500,600'
      ]
    },
  };

  tokenize = (e) => {
    e.preventDefault();
    this.setState({loading: true});
    // Call tokenize method through card component's ref
    this.cardRef.current.tokenize({}).then((data) => {
      this.setState({loading: false, token: data.token, errorMessage: ""});
    }).catch((error) => {
      this.setState({loading: false, token: "", errorMessage: "Problem while tokenizing your card details"});
    });
  }

  handleChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  start = () => {
    this.setState({ loading: true });
    // ajax request after empty completing
    // setTimeout(() => {
    //   this.setState({
    //     selectedRowKeys: [],
    //     loading: false,
    //   });
    // }, 1000);

    // var chargebee = new ChargeBee();

    // chargebee.configure({ site: "pixely-test", api_key: "test_jumo55anql2dcJF3USOARC0964wKp8NZ" });
    // chargebee.hosted_page
    //   .checkout_one_time_for_items({
    //     shipping_address: {
    //       first_name: "John",
    //       last_name: "Mathew",
    //       city: "Walnut",
    //       state: "California",
    //       zip: "91789",
    //       country: "US",
    //     },
    //     customer: {
    //       id: "__test__XpbXKKYSOUtL5p2E",
    //     },
    //     item_prices: [
    //       {
    //         item_price_id: "ssl-charge-USD",
    //         unit_price: 2000,
    //       },
    //     ],
    //   })
    //   .request( (error, result) => {
    //     if (error) {
    //       //handle error
    //       console.log(error);
    //       this.setState({
    //         selectedRowKeys: [],
    //         loading: false,
    //       });
    //     } else {
    //       console.log(`${result}`);
    //       var hosted_page: typeof chargebee.hosted_page = result.hosted_page;

    //       this.setState({
    //         selectedRowKeys: [],
    //         loading: false,
    //       });
    //     }
    //   });
  };

  // Validation error handling
  onChange = (event) => {
    const errors = this.state.errors;
    let errorMessage = '';

    if(event.error) {
      // If error is present, display the error
      errors[event.field] = event.error
      errorMessage = event.error.message
    } else {
      errors[event.field] = null
      // If there's no error, check for existing error
      const _errors = Object.values(errors).filter(val => val)
      
      // The errorObject holds a message and code
      // Custom error messages can be displayed based on the error code
      // const errorObj = _errors.pop();

      // // Display existing message
      // if(errorObj) errorMessage = errorObj.message
      // else errorMessage = ''
      errorMessage = ""
    }
    this.setState({
      errors,
      errorMessage,
    })
  }

  onSelectChange = (selectedRowKeys) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  render() {
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div>
         <CardComponent ref={this.cardRef} onChange={this.onChange}/>
        <h2>Users</h2>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={this.start} disabled={!hasSelected} loading={loading}>
            Upgrade
          </Button>

          <span style={{ marginLeft: 8 }}>{hasSelected ? `Selected ${selectedRowKeys.length} users` : ""}</span>
        </div>
        <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
      </div>
    );
  }
}

export default Membersv2;
