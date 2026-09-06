// import React, { useEffect, useState } from "react";

// const Rate = () => {
//   const [rates, setRates] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [prevRates, setPrevRates] = useState({});

//   useEffect(() => {
//     const fetchRates = async () => {
//       try {
//        // const res = await fetch("http://localhost:5000/api/rates");
//        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/rates`);
//         const data = await res.json();
//         if (data.rates) {
//           setPrevRates(
//             rates.reduce((acc, r) => {
//               acc[r.label] = r.price;
//               return acc;
//             }, {})
//           );
//           setRates(data.rates);
//         }
//       } catch (err) {
//         console.error("Error fetching rates:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRates();
//     const interval = setInterval(fetchRates, 10000); // auto refresh every 10s
//     return () => clearInterval(interval);
//   }, [rates]);

//   const getChangeClass = (label, price) => {
//     const prev = prevRates[label];
//     if (!prev) return "";
//     if (Number(price) > Number(prev)) return "bg-green-500 text-green-700";
//     if (Number(price) < Number(prev)) return "bg-red-500 text-red-700";
//     return "";
//   };

//   return (
//     <div className="mt-8 px-4">
//       <h2 className="text-2xl font-bold text-center mb-6">Today's Price</h2>

//       {loading ? (
//         <p className="text-center text-gray-500">Loading live rates...</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {rates.map((rate, idx) => (
//             <div
//               key={idx}
//               className={`p-5 rounded-2xl shadow-md border transition-all duration-500 ${getChangeClass(
//                 rate.label,
//                 rate.price
//               )}`}
//             >
//               <div className="flex items-center justify-between mb-2">
//                 <p className="text-2xl font-bold text-yellow-700">
//                   ₹ {rate.price}
//                 </p>
//                 <span className="flex items-center text-red-600 text-xs font-bold animate-pulse">
//                   <span className="w-2 h-2 bg-red-600 rounded-full mr-1"></span>
//                   LIVE
//                 </span>
//               </div>
//               <p className="text-gray-700 font-medium">{rate.label}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Rate;


// // left



import React, { useEffect, useRef, useState } from "react";

const Rate = () => {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Keeps previous rates without causing re-renders
  const previousRatesRef = useRef({});

  // Stores price movement
  const [rateChanges, setRateChanges] = useState({});

  // Stores timers for removing price change colors
  const changeTimersRef = useRef({});

  useEffect(() => {
    let isMounted = true;

    const fetchRates = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/rates`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch rates");
        }

        const data = await res.json();

        if (
          !data?.rates ||
          !Array.isArray(data.rates)
        ) {
          throw new Error("Invalid rates response");
        }

        if (!isMounted) return;

        const newChanges = {};

        data.rates.forEach((rate) => {
          const label = rate.label;
          const newPrice = Number(rate.price);

          const oldPrice =
            previousRatesRef.current[label];

          // We only compare if we have a previous price
          if (
            oldPrice !== undefined &&
            !isNaN(newPrice)
          ) {
            if (newPrice > oldPrice) {
              newChanges[label] = "up";
            } else if (newPrice < oldPrice) {
              newChanges[label] = "down";
            } else {
              newChanges[label] = "same";
            }
          } else {
            newChanges[label] = "same";
          }
        });

        // Save current rates as previous rates
        const currentRates = {};

        data.rates.forEach((rate) => {
          currentRates[rate.label] =
            Number(rate.price);
        });

        previousRatesRef.current = currentRates;

        // ==========================================
        // SHOW PRICE CHANGE FOR 7 SECONDS
        // ==========================================

        Object.keys(newChanges).forEach((label) => {
          const change = newChanges[label];

          // Only start timer when price actually changes
          if (
            change === "up" ||
            change === "down"
          ) {
            // Clear old timer if one already exists
            if (changeTimersRef.current[label]) {
              clearTimeout(
                changeTimersRef.current[label]
              );
            }

            // Remove color after 7 seconds
            changeTimersRef.current[label] =
              setTimeout(() => {
                if (!isMounted) return;

                setRateChanges((prev) => ({
                  ...prev,
                  [label]: "same",
                }));

                delete changeTimersRef.current[label];
              }, 4000);
          }
        });

        setRateChanges(newChanges);
        setRates(data.rates);
      } catch (err) {
        console.error(
          "Error fetching rates:",
          err
        );

        // IMPORTANT:
        // We do NOT clear existing rates here.
        // So if API temporarily fails,
        // the last successful rates remain visible.
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // ==========================================
    // FIRST FETCH
    // ==========================================

    fetchRates();

    // ==========================================
    // REFRESH EVERY 60 SECONDS
    // ==========================================

    const interval = setInterval(
      fetchRates,
      45000
    );

    return () => {
      isMounted = false;

      clearInterval(interval);

      // Clear all price change timers
      Object.values(
        changeTimersRef.current
      ).forEach((timer) => {
        clearTimeout(timer);
      });
    };
  }, []);

  // ==========================================
  // CARD COLOR
  // ==========================================

  const getChangeClass = (label) => {
    const change = rateChanges[label];

    if (change === "up") {
      return "border-green-500 bg-green-50";
    }

    if (change === "down") {
      return "border-red-500 bg-red-50";
    }

    return "border-gray-200 bg-white";
  };

  // ==========================================
  // PRICE COLOR
  // ==========================================

  const getPriceClass = (label) => {
    const change = rateChanges[label];

    if (change === "up") {
      return "text-green-700";
    }

    if (change === "down") {
      return "text-red-700";
    }

    return "text-yellow-700";
  };

  // ==========================================
  // PRICE ARROW
  // ==========================================

  const getArrow = (label) => {
    const change = rateChanges[label];

    if (change === "up") {
      return "↑";
    }

    if (change === "down") {
      return "↓";
    }

    return "";
  };

  return (
    <div className="mt-8 px-4">
      <h2 className="text-2xl font-bold text-center mb-6">
        Today's Price
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">
          Loading live rates...
        </p>
      ) : rates.length === 0 ? (
        <p className="text-center text-gray-500">
          Live rates are currently unavailable.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rates.map((rate, idx) => {
            const arrow = getArrow(rate.label);
            const change = rateChanges[rate.label];

            return (
              <div
                key={`${rate.label}-${idx}`}
                className={`p-5 rounded-2xl shadow-md border-2 transition-all duration-700 ${getChangeClass(
                  rate.label
                )}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <p
                      className={`text-2xl font-bold transition-colors duration-700 ${getPriceClass(
                        rate.label
                      )}`}
                    >
                      ₹{" "}
                      {Number(
                        rate.price
                      ).toLocaleString("en-IN")}
                    </p>

                    {arrow && (
                      <span
                        className={`text-2xl font-bold transition-all duration-700 ${
                          change === "up"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {arrow}
                      </span>
                    )}
                  </div>

                  {/* LIVE */}
                  <span className="flex items-center text-red-600 text-xs font-bold">
                    <span className="w-2 h-2 bg-red-600 rounded-full mr-1 animate-pulse"></span>
                    LIVE
                  </span>
                </div>

                <p
                  className={`font-medium transition-colors duration-700 ${
                    change === "up"
                      ? "text-green-700"
                      : change === "down"
                      ? "text-red-700"
                      : "text-gray-700"
                  }`}
                >
                  {rate.label}
                </p>

                {/* PRICE CHANGE STATUS */}
                {change === "up" && (
                  <p className="text-xs font-semibold text-green-600 mt-2">
                    Price increased ↑
                  </p>
                )}

                {change === "down" && (
                  <p className="text-xs font-semibold text-red-600 mt-2">
                    Price decreased ↓
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Rate;