'use client';

import React from 'react';
import { NewProductModal } from './NewProductModal';
import { NewSaleModal } from './NewSaleModal';
import { MovementModal } from './MovementModal';
import { ReportPreviewModal } from './ReportPreviewModal';

export function GlobalModals() {
  return (
    <>
      <NewProductModal />
      <NewSaleModal />
      <MovementModal />
      <ReportPreviewModal />
    </>
  );
}
