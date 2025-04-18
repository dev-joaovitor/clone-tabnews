import bcryptjs from "bcryptjs";

function applyPepperTo(text) {
  return text + (process?.env?.PEPPER ?? "SpiCy#PepPa");
}

async function hash(password) {
  const rounds = getNumberOfRounds();

  return await bcryptjs.hash(applyPepperTo(password), rounds);
}

function getNumberOfRounds() {
  return process.env.NODE_ENV === "production" ? 14 : 1;
}

async function compare(providedPassword, storedPassword) {
  return await bcryptjs.compare(
    applyPepperTo(providedPassword),
    storedPassword,
  );
}

const password = {
  hash,
  compare,
};

export default password;
