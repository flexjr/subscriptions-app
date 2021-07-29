import { useAuth0 } from "@auth0/auth0-react";
import React, { useState } from "react";
import { Avatar, Button, Table, Radio, Divider } from "antd";
import { ChargeBee, _hosted_page } from "chargebee-typescript";

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

class Members extends React.Component {
  cardRef = React.createRef();

  state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
  };

  start = () => {
    this.setState({ loading: true });
    // ajax request after empty completing
    // setTimeout(() => {
    //   this.setState({
    //     selectedRowKeys: [],
    //     loading: false,
    //   });
    // }, 1000);

    var chargebee = new ChargeBee();

    chargebee.configure({ site: "pixely-test", api_key: "test_jumo55anql2dcJF3USOARC0964wKp8NZ" });
    chargebee.hosted_page
      .checkout_one_time_for_items({
        shipping_address: {
          first_name: "John",
          last_name: "Mathew",
          city: "Walnut",
          state: "California",
          zip: "91789",
          country: "US",
        },
        customer: {
          id: "__test__XpbXKKYSOUtL5p2E",
        },
        item_prices: [
          {
            item_price_id: "ssl-charge-USD",
            unit_price: 2000,
          },
        ],
      })
      .request( (error, result) => {
        if (error) {
          //handle error
          console.log(error);
          this.setState({
            selectedRowKeys: [],
            loading: false,
          });
        } else {
          console.log(`${result}`);
          var hosted_page: typeof chargebee.hosted_page = result.hosted_page;

          this.setState({
            selectedRowKeys: [],
            loading: false,
          });
        }
      });
  };

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

export default Members;
