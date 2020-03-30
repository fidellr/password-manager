import React, { useState, useEffect } from "react";
import { Modal, Input, Button } from "antd";
import { useStoreState, useStoreActions } from "easy-peasy";

export default function({ modalType, isVisible, toggleModal }) {
  const [passwordData, setPasswordData] = useState({
    username: "",
    account_name: "",
    password: ""
  });

  const passwordDataStore = useStoreState(state => state.PasswordManager);
  const userTokenState = useStoreState(state => state.User.token);
  const selectedPassword = passwordDataStore.data;
  const updatePasswordDataApi = useStoreActions(
    actions => actions.PasswordManager.updatePasswordDataApi
  );
  const addPasswordDataApi = useStoreActions(
    actions => actions.PasswordManager.addPasswordDataApi
  );

  const resetPasswordDataState = () => {
    setPasswordData({ username: "", account_name: "", password: "" });
  };

  useEffect(() => {
    if (
      isVisible &&
      selectedPassword !== null &&
      selectedPassword._id.length > 0 &&
      passwordData.username.length < 1
    ) {
      setPasswordData(selectedPassword);
    }

    if (!isVisible && passwordData.password.length > 0)
      resetPasswordDataState();
  }, [
    isVisible,
    passwordData,
    selectedPassword
  ]);

  const handleChange = (key, val) => {
    setPasswordData({
      ...passwordData,
      [key]: val
    });
  };

  const handleSubmit = async () => {
    try {
      switch (modalType) {
        case "update":
          await updatePasswordDataApi({
            ...passwordData,
            token: userTokenState
          });
          toggleModal();
          break;
        case "create":
          await addPasswordDataApi({ ...passwordData, token: userTokenState });
          toggleModal();
          break;
        default:
          break;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const loading =
    passwordDataStore !== null && passwordDataStore.loading.is_loading === true
      ? true
      : false;

  const determineModalTitle = () => {
    switch (modalType) {
      case "update":
        return "Update Password Data";
      case "delete":
        return "Are you sure want to delete this?";
      case "view":
        return "Password Data Detail";
      case "create":
        return "Add New Password Data";
      default:
        break;
    }
  };

  return (
    <Modal
      title={determineModalTitle()}
      visible={isVisible && !loading}
      onOk={toggleModal}
      onCancel={toggleModal}
      footer={[
        <Button key="back" onClick={toggleModal}>
          Cancel
        </Button>,
        <Button key="submit" loading={loading} onClick={handleSubmit}>
          Submit
        </Button>
      ]}
    >
      <Input
        addonBefore="Username"
        placeholder="Insert username"
        value={passwordData.username}
        onChange={e => handleChange("username", e.target.value)}
        required
      />
      <Input
        addonBefore="Account Name"
        placeholder="Insert account name"
        style={{ margin: "16px 0" }}
        value={passwordData.account_name}
        onChange={e => handleChange("account_name", e.target.value)}
        required
      />
      <Input.Password
        addonBefore="Password"
        placeholder="Insert password"
        value={passwordData.password}
        onChange={e => handleChange("password", e.target.value)}
        required
      />
    </Modal>
  );
}
