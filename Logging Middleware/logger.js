const LOG_API = "http://20.244.56.144/evaluation-service/logs";


export const Log = async (stack, level, logPackage, message) => {
  const payload = {
    stack,
    level,
    package: logPackage,
    message,
  };

  try {
    const res = await fetch(LOG_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error(" Logging failed:", result);
    } else {
      console.log(" Log created:", result);
    }
  } catch (err) {
    console.error("Error sending log:", err);
  }
};