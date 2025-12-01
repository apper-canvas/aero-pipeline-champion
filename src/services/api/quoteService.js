import quotesData from '@/services/mockData/quotes.json'

let quotes = [...quotesData]

function delay(ms = 300) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function getNextId() {
  return quotes.length > 0 ? Math.max(...quotes.map(q => q.Id)) + 1 : 1
}

function generateQuoteNumber() {
  const year = new Date().getFullYear()
  const count = quotes.filter(q => q.quoteNumber.includes(year)).length + 1
  return `QUO-${year}-${count.toString().padStart(3, '0')}`
}

export async function getAll() {
  await delay()
  return quotes.map(quote => ({ ...quote }))
}

export async function getById(id) {
  await delay()
  const quote = quotes.find(q => q.Id === parseInt(id))
  return quote ? { ...quote } : null
}

export async function create(quoteData) {
  await delay()
  
  const newQuote = {
    ...quoteData,
    Id: getNextId(),
    quoteNumber: generateQuoteNumber(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  quotes.push(newQuote)
  return { ...newQuote }
}

export async function update(id, quoteData) {
  await delay()
  
  const index = quotes.findIndex(q => q.Id === parseInt(id))
  if (index === -1) {
    throw new Error('Quote not found')
  }
  
  const updatedQuote = {
    ...quotes[index],
    ...quoteData,
    Id: parseInt(id),
    updatedAt: new Date().toISOString()
  }
  
  quotes[index] = updatedQuote
  return { ...updatedQuote }
}

export async function deleteQuote(id) {
  await delay()
  
  const index = quotes.findIndex(q => q.Id === parseInt(id))
  if (index === -1) {
    throw new Error('Quote not found')
  }
  
  quotes.splice(index, 1)
  return true
}

export const quoteService = {
  getAll,
  getById,
  create,
  update,
  delete: deleteQuote
}