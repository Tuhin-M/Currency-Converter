import React, { useState, useEffect } from "react";
import { Select, Input, message, Typography } from "antd";
import axios from "axios";
import "./App.css";

// Ant Design components
const { Option } = Select;
const { Title } = Typography;

const CurrencyConverter = () => {
  // State hooks
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [exchangeRate, setExchangeRate] = useState(0);
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [countryFlags, setCountryFlags] = useState({});

  useEffect(() => {
    // Fetch exchange rates
    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get(
          `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
        );
        setCurrencies(Object.keys(response.data.rates));
        setExchangeRate(response.data.rates[toCurrency]);
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    };

    // Fetch country flags
    const fetchCountryFlags = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v2/all");
        const flags = response.data.reduce((acc, country) => {
          if (
            country.currencies &&
            country.currencies[0] &&
            country.currencies[0].code
          ) {
            acc[country.currencies[0].code] = country.flags.svg;
          }
          return acc;
        }, {});
        setCountryFlags(flags);
      } catch (error) {
        console.error("Error fetching country flags:", error);
      }
    };

    // Execute fetch functions
    fetchExchangeRates();
    fetchCountryFlags();
  }, [fromCurrency, toCurrency]);

  // Conversion calculation effect
  useEffect(() => {
    setConvertedAmount((amount * exchangeRate).toFixed(2));
  }, [amount, exchangeRate]);

  // Amount change handler
  const handleAmountChange = (value) => {
    if (!isNaN(value) && value >= 0) {
      setAmount(value);
    } else {
      message.error("Please enter a valid amount");
    }
  };

  // Component render
  return (
    <div className="header">
      <Title level={3}>$ Currency Converter</Title>
      <div className="currencyConverter">
        <Select
          value={fromCurrency}
          className="currencyDropdown"
          onChange={setFromCurrency}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {currencies.map((currency) => (
            <Option key={currency} value={currency}>
              <div className="currencyOption">
                <img
                  className="currencyFlag"
                  src={countryFlags[currency]}
                  alt={`${currency} flag`}
                />
                {currency}
              </div>
            </Option>
          ))}
        </Select>

        <Input
          placeholder="Amount"
          value={amount}
          onChange={(e) => handleAmountChange(e.target.value)}
          className="formControl"
        />
        <Select
          value={toCurrency}
          className="currencyDropdown"
          onChange={setToCurrency}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              <div className="currencyOption">
                <img
                  className="currencyFlag"
                  src={countryFlags[currency]}
                  alt={`${currency} flag`}
                />
                {currency}
              </div>
            </option>
          ))}
        </Select>
        <p className="convertedAmount">
          Converted Amount: {convertedAmount} {toCurrency}
        </p>
      </div>
    </div>
  );
};

export default CurrencyConverter;
