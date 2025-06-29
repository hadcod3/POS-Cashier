import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, X } from "lucide-react"
import { FormVariant } from '@/types'

interface VariantManagerProps {
  variants: FormVariant[];
  setVariants: (variants: FormVariant[]) => void;
}

const VariantManager = ({ variants, setVariants }: VariantManagerProps) => {
  const addVariant = () => {
    setVariants([...variants, { name: '', options: [{ label: '', price: 0 }] }])
  }

  const removeVariant = (index: number) => {
    const updated = [...variants]
    updated.splice(index, 1)
    setVariants(updated)
  }

  const updateVariantName = (index: number, value: string) => {
    const updated = [...variants]
    updated[index].name = value
    setVariants(updated)
  }

  const addOption = (variantIndex: number) => {
    const updated = [...variants]
    updated[variantIndex].options.push({ label: '', price: 0 })
    setVariants(updated)
  }

  const removeOption = (variantIndex: number, optionIndex: number) => {
    const updated = [...variants]
    updated[variantIndex].options.splice(optionIndex, 1)
    setVariants(updated)
  }

  const updateOptionLabel = (variantIndex: number, optionIndex: number, value: string) => {
    const updated = [...variants]
    updated[variantIndex].options[optionIndex].label = value
    setVariants(updated)
  }

  const updateOptionPrice = (variantIndex: number, optionIndex: number, value: number) => {
    const updated = [...variants]
    updated[variantIndex].options[optionIndex].price = value
    setVariants(updated)
  }

  return (
    <div className="space-y-3">
      {variants.map((variant, vIndex) => (
        <div key={vIndex} className="p-3 border rounded-lg">
          <div className="flex items-center justify-between mb-3 gap-3">
            <Input
              placeholder="Variant name (e.g. Size)"
              value={variant.name}
              onChange={(e) => updateVariantName(vIndex, e.target.value)}
              className="w-full"
            />
            <Button 
              type="button" 
              variant="destructive" 
              size="icon"
              onClick={() => removeVariant(vIndex)}
            >
              <X size={16} />
            </Button>
          </div>

          <div className="space-y-3">
            {variant.options.map((option, oIndex) => (
              <div key={oIndex} className="flex flex-col md:flex-row md:items-center gap-3">
                <Input
                  placeholder="Option label (e.g. Small)"
                  value={option.label}
                  onChange={(e) => updateOptionLabel(vIndex, oIndex, e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Price"
                  min={0}
                  value={option.price || ''}
                  onChange={(e) => updateOptionPrice(vIndex, oIndex, Number(e.target.value))}
                />
                {variant.options.length > 1 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    onClick={() => removeOption(vIndex, oIndex)}
                  >
                    <X size={16} />
                  </Button>
                )}
              </div>
            ))}
            <Button 
              type="button" 
              variant="secondary" 
              size="sm"
              onClick={() => addOption(vIndex)}
            >
              <Plus size={16}  /> Add Option
            </Button>
          </div>
        </div>
      ))}

      <Button 
        type="button" 
        variant="outline"
        onClick={addVariant}
        className="w-full"
      >
        <Plus size={16} /> Add Variant
      </Button>
    </div>
  )
}

export default VariantManager
