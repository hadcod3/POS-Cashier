  // 'use client';

  // import { useState, useEffect } from 'react';
  // import {
  //   Dialog,
  //   DialogContent,
  //   DialogHeader,
  //   DialogTitle,
  // } from '@/components/ui/dialog';
  // import { Button } from '@/components/ui/button';
  // import { IItem } from '@/lib/database/models/item.model';
  // import { Input } from '@/components/ui/input';
  // import { useCart } from './CartContext';

  // interface ItemModalProps {
  //   item: IItem | null;
  //   open: boolean;
  //   onClose: () => void;
  //   editIndex?: number | null;
  // }

  // const ItemModal = ({ item, open, onClose, editIndex = null }: ItemModalProps) => {
  //   const { addToCart, updateCartItem } = useCart();
  //   const [quantity, setQuantity] = useState<number>(1);
  //   const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  //   useEffect(() => {
  //     if (!open || !item) return;
  //     setQuantity(item.minOrder || 1);

  //     const defaultOptions: Record<string, string> = {};
  //     item.variants?.forEach((variant) => {
  //       defaultOptions[variant.name] = variant.options[0]?.label || '';
  //     });

  //     setSelectedOptions(defaultOptions);
  //   }, [open]);

  //   if (!item) return null;

  //   const handleAddOrUpdate = () => {
  //     const variantLabel = Object.entries(selectedOptions)
  //       .sort(([a], [b]) => a.localeCompare(b))
  //       .map(([_, label]) => label.trim())
  //       .join(' | ')
  //       .trim();

  //     // ✅ Calculate variantPrice
  //     let variantPrice = 0;
  //     if (item?.variants) {
  //       item.variants.forEach((variant) => {
  //         const selectedLabel = selectedOptions[variant.name];
  //         const foundOption = variant.options.find((opt) => opt.label === selectedLabel);
  //         if (foundOption) variantPrice += foundOption.price;
  //       });
  //     }

  //     const cartEntry = {
  //       item,
  //       quantity,
  //       variantLabel: variantLabel || undefined,
  //       variantPrice: variantPrice || 0, // ✅ pass it
  //     };

  //     if (editIndex !== null) {
  //       updateCartItem(editIndex, cartEntry);
  //     } else {
  //       addToCart(cartEntry);
  //     }

  //     onClose();
  //   };

  //   return (
  //     <Dialog open={open} onOpenChange={onClose}>
  //       <DialogContent className="max-w-md">
  //         <DialogHeader>
  //           <DialogTitle>{item.name}</DialogTitle>
  //         </DialogHeader>

  //         {item.variants && item.variants?.length > 0 && (
  //           <div className="space-y-4">
  //             {item.variants.map((variant, idx) => (
  //               <div key={idx}>
  //                 <label className="block text-sm font-medium mb-1">{variant.name}</label>
  //                 <select
  //                   value={selectedOptions[variant.name]}
  //                   onChange={(e) =>
  //                     setSelectedOptions((prev) => ({
  //                       ...prev,
  //                       [variant.name]: e.target.value,
  //                     }))
  //                   }
  //                   className="w-full border border-gray-300 p-2 rounded-md"
  //                 >
  //                   {variant.options.map((option, oidx) => (
  //                     <option key={oidx} value={option.label}>
  //                       {option.label} - Rp {option.price.toLocaleString()}
  //                     </option>
  //                   ))}
  //                 </select>
  //               </div>
  //             ))}
  //           </div>
  //         )}

  //         <div className="mt-4">
  //           <label className="block text-sm font-medium mb-1">Quantity</label>
  //           <Input
  //             type="number"
  //             min={item.minOrder || 1}
  //             value={quantity}
  //             onChange={(e) => {
  //               const q = parseInt(e.target.value) || item.minOrder || 1;
  //               setQuantity(Math.max(item.minOrder || 1, q));
  //             }}
  //             className="w-20"
  //           />
  //         </div>

  //         <div className="mt-6 flex justify-end gap-2">
  //           <Button variant="outline" onClick={onClose}>
  //             Cancel
  //           </Button>
  //           <Button onClick={handleAddOrUpdate}>
  //             {editIndex !== null ? 'Update Cart' : 'Add to Cart'}
  //           </Button>
  //         </div>
  //       </DialogContent>
  //     </Dialog>
  //   );
  // };

  // export default ItemModal;
