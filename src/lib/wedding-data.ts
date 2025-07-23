import { promises as fs } from 'fs'
import path from 'path'

export interface WeddingConfig {
  id: string
  title: string
  slug: string
  description?: string
  date: string
  coupleEmail: string
  coupleNames: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

const DATA_FILE = path.join(process.cwd(), 'data', 'weddings.json')

async function ensureDataDir() {
  const dataDir = path.dirname(DATA_FILE)
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

export async function loadWeddings(): Promise<WeddingConfig[]> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function saveWeddings(weddings: WeddingConfig[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(DATA_FILE, JSON.stringify(weddings, null, 2))
}

export async function getWeddingBySlug(slug: string): Promise<WeddingConfig | undefined> {
  const weddings = await loadWeddings()
  return weddings.find(wedding => wedding.slug === slug && wedding.isActive)
}

export async function getActiveWeddings(): Promise<WeddingConfig[]> {
  const weddings = await loadWeddings()
  return weddings.filter(wedding => wedding.isActive)
}

export async function getAllWeddings(): Promise<WeddingConfig[]> {
  return await loadWeddings()
}

export async function createWedding(weddingData: Omit<WeddingConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<WeddingConfig> {
  const weddings = await loadWeddings()
  
  const newWedding: WeddingConfig = {
    ...weddingData,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  weddings.push(newWedding)
  await saveWeddings(weddings)
  return newWedding
}

export async function updateWedding(id: string, updates: Partial<WeddingConfig>): Promise<WeddingConfig | null> {
  const weddings = await loadWeddings()
  const index = weddings.findIndex(w => w.id === id)
  
  if (index === -1) return null
  
  weddings[index] = {
    ...weddings[index],
    ...updates,
    updatedAt: new Date().toISOString()
  }
  
  await saveWeddings(weddings)
  return weddings[index]
}

export async function deleteWedding(id: string): Promise<boolean> {
  const weddings = await loadWeddings()
  const filteredWeddings = weddings.filter(w => w.id !== id)
  
  if (filteredWeddings.length === weddings.length) return false
  
  await saveWeddings(filteredWeddings)
  return true
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}