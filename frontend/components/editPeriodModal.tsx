'use client';
import { useState } from 'react';
//Estilização
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

//API
import { deleteDemand } from '@/lib/api';
import { updateDemand } from '@/lib/api';

//Icons
import { Trash2 } from 'lucide-react';

interface Demand {
    id: string;
    sku: string;
    description?: string;
    totalPlan: number;
    totalProd: number;
}

interface EditPeriodModalProps {
    isOpen: boolean;
    onClose: () => void;
    demands: Demand[];
    periodId: string;
    onSave: () => void;
}

export default function EditPeriodModal({
    isOpen,
    onClose,
    demands: initialDemands,
    onSave,
}: EditPeriodModalProps) {
    const [demands, setDemands] = useState<Demand[]>(initialDemands);

    const handleChange = (id: string, field: keyof Demand, value: string | number) => {
        setDemands((prev) =>
            prev.map((d) =>
                d.id === id
                    ? {
                          ...d,
                          [field]:
                              field === 'sku' || field === 'description' ? value : Number(value),
                      }
                    : d
            )
        );
    };

    const handleDelete = async (id: string) => {
        if (confirm('Tem certeza que deseja excluir esta demanda?')) {
            try {
                await deleteDemand(id);
                setDemands((prev) => prev.filter((d) => d.id !== id));

                toast.success('Demanda escluída com sucesso!'); //Nao funcionou, shadcn disse que estava descontinuado
                //mas com sonner era para funcionar, e bom... nao funcinou
            } catch (error) {
                toast.error('Erro ao escluir demanda');
                console.log(error);
            }
        }
    };

    const handleSave = async () => {
        try {
            for (const demand of demands) {
                await updateDemand(demand.id, {
                    totalPlan: demand.totalPlan,
                    totalProd: demand.totalProd,
                });
            }
            onSave();
            onClose();
        } catch (err) {
            console.error('Erro ao salvar alterações:', err);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Editar Demandas</DialogTitle>
                </DialogHeader>

                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="p-3 border-b">SKU</th>
                            <th className="p-3 border-b">Descrição</th>
                            <th className="p-3 border-b">Total Plan</th>
                            <th className="p-3 border-b">Total Prod</th>
                            <th className="p-3 border-b">Remover</th>
                        </tr>
                    </thead>
                    <tbody>
                        {demands.map((demand) => (
                            <tr key={demand.id}>
                                <td className="p-2 border-b">{demand.sku}</td>
                                <td className="p-2 border-b">{demand.description || '-'}</td>
                                <td className="p-2 border-b">
                                    <Input
                                        type="number"
                                        value={demand.totalPlan}
                                        onChange={(e) =>
                                            handleChange(demand.id, 'totalPlan', e.target.value)
                                        }
                                        className="w-24"
                                    />
                                </td>
                                <td className="p-2 border-b">
                                    <Input
                                        type="number"
                                        value={demand.totalProd}
                                        onChange={(e) =>
                                            handleChange(demand.id, 'totalProd', e.target.value)
                                        }
                                        className="w-24"
                                    />
                                </td>
                                <td className="p-2 border-b text-center">
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(demand.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex justify-end gap-3 mt-4">
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSave}>Salvar</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
