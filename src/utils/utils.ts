export function generateRandomNumber() {
  return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
}

export function generateExpiryTime(): Date {
  const expirationDate = new Date();
  expirationDate.setMinutes(expirationDate.getMinutes() + 15); // Add 15 minutes to the current time
  return expirationDate; // Return the time as milliseconds since the Unix epoch
}

export function isExpired(date: Date): boolean {
  const currentDate = new Date();
  return date < currentDate;
}

export function generateRandomReference() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';

  let result = '';

  // Ajouter 3 lettres majuscules aléatoires
  for (let i = 0; i < 3; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  // Ajouter 4 chiffres aléatoires
  for (let i = 0; i < 4; i++) {
    result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  return result;
}

export function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}