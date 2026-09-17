import { useState, useEffect } from 'react';
import { Product } from '@/modules/catalog/domain/entities/Product';
import { ProductRepository } from '@/modules/catalog/infrastructure/productRepository';
import { PaymentConfig } from '../domain/entities/AdminConfig';
import { AdminRepository } from '../infrastructure/adminRepository';
import { toast } from '@/core/utils/toast';

export function useAdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [storeConfig, setStoreConfig] = useState<PaymentConfig>(() => AdminRepository.getPaymentConfig());
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [isCanvaModalOpen, setIsCanvaModalOpen] = useState<boolean>(false);
  const [canvaPriceCorreo, setCanvaPriceCorreo] = useState<number>(18000);
  const [canvaPrice1M, setCanvaPrice1M] = useState<number>(15000);
  const [canvaPrice6M, setCanvaPrice6M] = useState<number>(50000);
  const [canvaPrice12M, setCanvaPrice12M] = useState<number>(80000);

  useEffect(() => {
    setProducts(ProductRepository.getProducts());
  }, []);

  const notify = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 2800);
  };

  const handleToggleAvailability = (productId: number, productName: string) => {
    const updated = ProductRepository.toggleAvailability(productId);
    if (updated) {
      setProducts(ProductRepository.getProducts());
      notify(`Estado de ${productName}: ${updated.available ? 'Entrega Inmediata' : 'Agotado'}`);
    }
  };

  const handleDeleteProduct = (productId: number, name: string) => {
    toast.confirm({
      title: '¿Eliminar Servicio?',
      message: `¿Seguro que deseas eliminar "${name}" del catálogo?`,
      confirmText: 'Sí, Eliminar',
      cancelText: 'Cancelar',
      variant: 'danger',
      onConfirm: () => {
        ProductRepository.deleteProduct(productId);
        setProducts(ProductRepository.getProducts());
        toast.success(`Servicio "${name}" eliminado.`);
      },
    });
  };

  const handleResetCatalog = () => {
    toast.confirm({
      title: '¿Restablecer Catálogo?',
      message: '¿Restablecer todo el catálogo a los datos iniciales?',
      confirmText: 'Sí, Restablecer',
      cancelText: 'Cancelar',
      variant: 'warning',
      onConfirm: () => {
        setProducts(ProductRepository.resetToDefaults());
        toast.success('Catálogo restablecido.');
      },
    });
  };

  const handleSaveStoreConfig = (e: React.FormEvent) => {
    e.preventDefault();
    AdminRepository.savePaymentConfig(storeConfig);
    toast.success('Configuración guardada.');
  };

  return {
    products, setProducts, storeConfig, setStoreConfig, successMessage, searchFilter, setSearchFilter,
    isCanvaModalOpen, setIsCanvaModalOpen, canvaPriceCorreo, setCanvaPriceCorreo, canvaPrice1M, setCanvaPrice1M,
    canvaPrice6M, setCanvaPrice6M, canvaPrice12M, setCanvaPrice12M, notify, handleToggleAvailability,
    handleDeleteProduct, handleResetCatalog, handleSaveStoreConfig
  };
}
