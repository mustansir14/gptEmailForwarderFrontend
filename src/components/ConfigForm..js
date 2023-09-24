import React, { useState, useEffect } from "react";
import "./ConfigForm.css";

function ConfigForm() {
  const [config, setConfig] = useState(null);
  const [newReceiver, setNewReceiver] = useState({ name: "", email: "" });

  useEffect(() => {
    // Fetch initial config from the API when the component mounts
    fetch("http://127.0.0.1:8000")
      .then((response) => response.json())
      .then((data) => {
        setConfig(data);
      })
      .catch((error) => {
        console.error("Error fetching config:", error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setConfig((prevConfig) => ({
      ...prevConfig,
      [name]: value,
    }));
  };

  const handleReceiverChange = (e, index) => {
    const { name, value } = e.target;
    setConfig((prevConfig) => {
      const newReceivers = [...prevConfig.receiver_emails];
      newReceivers[index][name] = value;
      return {
        ...prevConfig,
        receiver_emails: newReceivers,
      };
    });
  };

  const addReceiver = () => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      receiver_emails: [...prevConfig.receiver_emails, newReceiver],
    }));
    setNewReceiver({ name: "", email: "" });
  };

  const removeReceiver = (index) => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      receiver_emails: prevConfig.receiver_emails.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send the updated config to the server using an API call
    fetch("http://127.0.0.1:8000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(config),
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Config updated!");
      })
      .catch((error) => {
        alert("Error updating config:", error);
      });
  };

  if (!config) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Configuration Form</h1>
      <form onSubmit={handleSubmit} className="config-form">
        <div className="form-group">
          <label>IMAP Host:</label>
          <input
            type="text"
            name="imap_host"
            value={config.imap_host}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>IMAP Port:</label>
          <input
            type="number"
            name="imap_port"
            value={config.imap_port}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="text"
            name="email"
            value={config.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="text"
            name="password"
            value={config.password}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>SMTP Server:</label>
          <input
            type="text"
            name="smtp_server"
            value={config.smtp_server}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>SMTP Port:</label>
          <input
            type="number"
            name="smtp_port"
            value={config.smtp_port}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>OpenAI API Key:</label>
          <input
            type="text"
            name="openai_api_key"
            value={config.openai_api_key}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Prompt Subject Line:</label>
          <textarea
            name="prompt_subject_line"
            value={config.prompt_subject_line}
            onChange={handleInputChange}
            rows={17} // Adjust the number of rows as needed
          />
        </div>
        <div className="form-group">
          <label>Prompt Forward Email:</label>
          <textarea
            name="prompt_forward_email"
            value={config.prompt_forward_email}
            onChange={handleInputChange}
            rows={10} // Adjust the number of rows as needed
          />
        </div>

        {/* Receiver Emails */}
        <div className="form-group">
          <h2>Receiver Emails</h2>
          {config.receiver_emails.map((receiver, index) => (
            <div key={index} className="receiver-group">
              <input
                type="text"
                name="name"
                value={receiver.name}
                onChange={(e) => handleReceiverChange(e, index)}
              />
              <input
                type="text"
                name="email"
                value={receiver.email}
                onChange={(e) => handleReceiverChange(e, index)}
              />
              <button
                type="button"
                className="remove-btn"
                onClick={() => removeReceiver(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <div className="receiver-group">
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={newReceiver.name}
              onChange={(e) =>
                setNewReceiver({ ...newReceiver, name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Email"
              name="email"
              value={newReceiver.email}
              onChange={(e) =>
                setNewReceiver({ ...newReceiver, email: e.target.value })
              }
            />
            <button
              type="button"
              style={{ backgroundColor: "#007bff" }}
              onClick={addReceiver}
            >
              Add
            </button>
          </div>
        </div>
        <button type="submit" className="add-btn">
          Save
        </button>
      </form>
    </div>
  );
}

export default ConfigForm;
