import { useEffect, useState } from "react";
import "./App.css";

function App() {
   const [amount, setAmount] = useState(1);
   const [convertFrom, setConvertFrom] = useState("USD");
   const [convertTo, setConvertTo] = useState("EUR");
   const [convertedAmount, setConvertedAmount] = useState("");
   useEffect(
      function () {
         const controller = new AbortController();
         async function converCurrency(
            amount: number,
            from: string,
            to: string
         ): Promise<void> {
            try {
               if (amount === 0) {
                  setConvertedAmount("0");
                  return;
               }
               if (from === to) {
                  setConvertedAmount(String(amount));
                  return;
               }
               const res = await fetch(
                  `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`,
                  { signal: controller.signal }
               );
               const {
                  rates: { [to]: convertedAmount },
               } = await res.json();
               setConvertedAmount(convertedAmount);
               console.log(
                  "DEBUG: ~ converCurrency ~ convertedAm:",
                  convertedAmount
               );
            } catch (error) {
               console.log("DEBUG: ~ converCurrency ~ error:", error);
            }
         }
         converCurrency(amount, convertFrom, convertTo);
         return () => controller.abort();
      },
      [amount, convertFrom, convertTo]
   );
   return (
      <div className="currency-converter">
         <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="currency-input"
            placeholder="Enter amount"
         />
         <select
            value={convertFrom}
            onChange={(e) => setConvertFrom(e.target.value)}
            className="currency-select"
         >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="CAD">CAD</option>
            <option value="INR">INR</option>
         </select>
         <select
            value={convertTo}
            onChange={(e) => setConvertTo(e.target.value)}
            className="currency-select"
         >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="CAD">CAD</option>
            <option value="INR">INR</option>
         </select>
         <p className="converted-amount">
            {convertedAmount} {convertTo}
         </p>
      </div>
   );
}

export default App;
