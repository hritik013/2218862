const LOG_API = "http://20.244.56.144/evaluation-service/logs";

const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJyYXdhdGhyaXRpazE5QGdtYWlsLmNvbSIsImV4cCI6MTc1MjU2NDU3NiwiaWF0IjoxNzUyNTYzNjc2LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiMDEzMTkzYmItOTNkMC00YjRjLThhNjctNTA4Mzg4YzA3OTE5IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiaHJpdGlrIHJhd2F0Iiwic3ViIjoiNjg3MjgyMTktMzYzZS00N2UwLTg0ZTUtNmY0NWU0NGViNDlkIn0sImVtYWlsIjoicmF3YXRocml0aWsxOUBnbWFpbC5jb20iLCJuYW1lIjoiaHJpdGlrIHJhd2F0Iiwicm9sbE5vIjoiMjIxODg2MiIsImFjY2Vzc0NvZGUiOiJRQWhEVXIiLCJjbGllbnRJRCI6IjY4NzI4MjE5LTM2M2UtNDdlMC04NGU1LTZmNDVlNDRlYjQ5ZCIsImNsaWVudFNlY3JldCI6InVyTUZiUWhucXFnbmRVU3UifQ.xx68nr8P8itFZ0YhCOzioelFRKysarWICNE4trkZ4m0";

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
        "Authorization": `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    
  } catch (err) {
  }
};
