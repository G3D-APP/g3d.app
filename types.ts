
export type Role = 'ADMIN' | 'SELLER' | 'COLLABORATOR';

export type OrderStatus = 'PRESUPUESTO' | 'FALTA_DISENAR' | 'DISENADO' | 'EN_PRODUCCION' | 'PENDIENTE_ENTREGA' | 'ENTREGADO';

export interface Permissions {
  // Pedidos
  canCreateOrders: boolean;
  canEditOrders: boolean;
  viewAllOrders: boolean; // Ver todos vs solo propios
  canDeleteOrders: boolean;
  
  // Inventario
  canManageInventory: boolean; // Crear/Editar productos
  canAdjustStock: boolean; // Modificar stock rápido
  
  // Finanzas & Herramientas
  useCalculator: boolean;
  canManageFinancials: boolean; // Marcar pagado, editar precios manuales
  editCostParams: boolean; // Configurar costos fijos/base
  
  // Admin
  canManageUsers: boolean; // Crear/Editar usuarios
  canExportData: boolean; // Descargar Excel/Backup
}

export interface AppRole {
  id: string;
  name: string;
  description: string;
  isSystem?: boolean; // Roles del sistema no se pueden borrar (Admin)
  permissions: Permissions;
}

export interface User {
  id: string;
  username: string;
  role: Role; // Mantenemos string para compatibilidad legacy
  roleId?: string; // Link al rol dinámico
  name: string;
  permissions: Permissions;
  createdAt: string;
  password?: string;
  image?: string;
  phone?: string;
}

// Nueva interfaz unificada para el inventario
export interface InventoryItem {
  id: string;
  category: 'FILAMENT' | 'PRINTED' | 'EXTRA' | 'SIGNAGE';
  name: string;
  stock: number;
  minStock?: number;
  price: number; // Precio de venta
  cost: number;  // Costo
  
  // Campos opcionales específicos
  sku?: string;
  brand?: string;
  weight?: string; // "1kg", "250g"
  color?: string; // Tailwind class "bg-red-500"
  type?: string; // "PLA", "PETG"
  unit?: string; // "m2", "unid"
  unitType?: 'pack' | 'unit' | 'bag'; // Para iconos visuales
  details?: string; // Descripción Pública
  privateDescription?: string; // Descripción Privada (Solo usuarios registrados)
  image?: string; // Imagen principal (thumbnail)
  images?: string[]; // Array de imágenes (Galería completa)
  fileType?: string; // STL, OBJ
  printTime?: string;
  supplier?: string; // Nombre Proveedor
  supplierContact?: string; // Celular/Contacto Proveedor
  supplierLink?: string; // Web/Link Proveedor
  isNonConsumable?: boolean; // Nuevo campo: Material no consumible / Herramienta
}

export interface OrderItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  currentStock?: number;
  price?: number;
}

export interface Order {
  id: string;
  orderNumber: number;
  createdAt: string;
  deadline?: string;
  sellerId: string;
  sellerName: string;
  customerName: string;
  type: string;
  details: string;
  status: OrderStatus;
  priority: number;
  items?: OrderItem[];
  financials: {
    price: number;
    deposit: number;
    isPaid: boolean;
  };
}

export interface CostSettings {
  // Legacy / Basic
  filamentType: string;
  profitMargin: number;
  
  // Fixed Costs / Infrastructure
  rent: number;
  electricity: number;
  water: number;
  internet: number;
  
  // Labor
  baseSalary: number;
  employees: number;
  
  // Farm Capacity
  monthlyHours: number; // Operational hours per month
  printers: number;     // Number of active printers
  
  // Technical Factors
  errorMargin: number; // %
  maintenanceMargin: number; // %
  
  // Material Specs
  filamentCost: number; // Cost per 1kg Spool
  metersPerKg: number;  // Meters in 1kg (approx 330m for PLA 1.75)
}

export interface Material {
  id: string;
  name: string;
  unit: string;
  price: number;
}

export interface BusinessInfo {
  address: string;
  phone: string;
  instagram: string;
  web: string;
  email: string;
}

export interface AppConfig {
  jobTypes: string[];
  materials: Material[];
  costs: CostSettings;
  logoUrl: string;
  backgroundUrl: string;
  statusPriorities: OrderStatus[]; // Order of importance for sorting
  businessInfo?: BusinessInfo;
  
  // Auto Backup Configuration
  backupEmail?: string;
  backupFrequency?: 'OFF' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
  lastBackupDate?: string;
}
