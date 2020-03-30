import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm } from "antd";
import styled from "styled-components";
import { useStoreActions, useStoreState } from "easy-peasy";
import { PlusOutlined } from "@ant-design/icons";
import { truncateString } from "../../utils/helpers/string";
import SectionModal from "./SectionModal";

const TableActionButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  & p {
    margin: 0;
    &:nth-child(even) {
      padding: 0 6px;
    }
  }
`;

const StyledAddButtonWrapper = styled.div`
  position: fixed;
  bottom: 10px;
  right: 10px;
`;

export default function() {
  const passwordDataStore = useStoreState(state => state.PasswordManager);
  const getAllPasswordDataApi = useStoreActions(
    actions => actions.PasswordManager.getAllPasswordDataApi
  );

  const userTokenState = useStoreState(state => state.User.token);
  const appBrowserDeviceIsMobile = useStoreState(state => state.App.is_mobile);
  const [passwordData, setPasswordData] = useState(null);
  const [isModalOpened, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [isRemovePopoverOpen, setRemovePopOverOpen] = useState(false);
  const getSelectedPasswordDataAction = useStoreActions(
    actions => actions.PasswordManager.getSelectedPasswordData
  );
  const getSelectedPasswordDataApi = useStoreActions(
    actions => actions.PasswordManager.getSelectedPasswordDataApi
  );
  const deleteSelectedPasswordDataApi = useStoreActions(
    actions => actions.PasswordManager.deletePasswordDataApi
  );

  useEffect(() => {
    if (!passwordDataStore.passwords && userTokenState) {
      getAllPasswordDataApi({ token: userTokenState });
    }
  }, [getAllPasswordDataApi, passwordDataStore.passwords, userTokenState]);

  useEffect(() => {
    if (
      passwordDataStore &&
      passwordDataStore.passwords &&
      passwordDataStore.passwords.length
    ) {
      setPasswordData(
        passwordDataStore.passwords.map((item, i) => {
          return {
            key: i,
            no: i + 1,
            action: item,
            ...item
          };
        })
      );
    }
  }, [getAllPasswordDataApi, passwordDataStore, userTokenState]);

  const loading =
    passwordDataStore !== null && passwordDataStore.loading.is_loading === true
      ? true
      : false;

  const toggleModal = (action, data) => {
    setModalType(action);
    if (data) {
      getSelectedPasswordDataApi({ token: userTokenState, ...data });
    } else {
      getSelectedPasswordDataAction({
        _id: "",
        username: "",
        password: "",
        account_name: ""
      });
    }

    if (isModalOpened) {
      setModalOpen(false);
      getAllPasswordDataApi({ token: userTokenState });
      return;
    }

    setModalOpen(true);
  };

  const togglePopConfirm = async id => {
    if (typeof id === "string" && isRemovePopoverOpen) {
      await deleteSelectedPasswordDataApi({ _id: id, token: userTokenState });
      setRemovePopOverOpen(false);
      await getAllPasswordDataApi({ token: userTokenState });
      return;
    }
    setRemovePopOverOpen(true);
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "no",
      key: "no"
    },
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id"
    },
    {
      title: "Account Name",
      dataIndex: "account_name",
      key: "account_name"
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username"
    },
    {
      title: "Password",
      dataIndex: "password",
      key: "password",
      render: password => <span>{truncateString(10, password)}</span>
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      render: password => {
        return (
          <TableActionButtonsWrapper>
            <Button type="link" onClick={() => toggleModal("update", password)}>
              Edit
            </Button>
            <Popconfirm
              title="Are you sure want to delete this data?"
              onConfirm={() => togglePopConfirm(password._id)}
              onCancel={togglePopConfirm}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="link"
                danger
                onClick={() => togglePopConfirm()}
                loading={loading}
              >
                Remove
              </Button>
            </Popconfirm>
          </TableActionButtonsWrapper>
        );
      }
    }
  ];

  return (
    <>
      <Table
        bordered
        title={() => (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <p style={{ margin: 0 }}>Password Manager Available Data</p>
            {!appBrowserDeviceIsMobile && (
              <Button
                onClick={() => toggleModal("create", null)}
                type="primary"
                size="middle"
                icon={<PlusOutlined />}
              >
                Add Password Data
              </Button>
            )}
          </div>
        )}
        size="small"
        loading={loading}
        columns={columns}
        dataSource={passwordData}
      />
      <SectionModal
        modalType={modalType}
        isVisible={isModalOpened}
        toggleModal={toggleModal}
      />
      {appBrowserDeviceIsMobile && (
        <StyledAddButtonWrapper>
          <Button
            type="primary"
            size="large"
            shape="circle"
            onClick={() => toggleModal("create", null)}
            icon={<PlusOutlined />}
          />
        </StyledAddButtonWrapper>
      )}
    </>
  );
}
