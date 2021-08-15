import { Button, Table } from "antd";
import React, { useState, useRef } from "react";

const columns = [
  {
    title: "User ID",
    dataIndex: "user_id",
  },
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
    user_id: `4851FX210${i}`,
    name: `Edward King ${i}`,
    email: "king@hooli.xyz",
    invitation_date: `Jul ${i}, 2021`,
    account_status: "Active",
    subscription_plan: "Flex Starter",
    actions: "",
  });
}

export const Members: React.FunctionComponent = () => {
  const cardRef = useRef();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // Check here to configure the default column
  const [loading, setLoading] = useState(false);

  const start = (): void => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  const onSelectChange = (selectedRowKeys): void => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  return (
    <div>
      <h2>Users</h2>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={start} disabled={!hasSelected} loading={loading}>
          Upgrade
        </Button>

        <span style={{ marginLeft: 8 }}>{hasSelected ? `Selected ${selectedRowKeys.length} users` : ""}</span>
      </div>
      <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
    </div>
  );
};
