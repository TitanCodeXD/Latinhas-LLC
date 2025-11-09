'use client';
import { useState } from 'react';
//Estilização
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

//API
import { deleteDemand } from '@/lib/api';
import { updateDemand } from '@/lib/api';
import { deletePeriod } from '@/lib/api';

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
    periodId,
    onSave,
}: EditPeriodModalProps) {
    const [demands, setDemands] = useState<Demand[]>(initialDemands);
    //Apenas para controlar o alert do shadcn
    const [deleteAction, setDeleteAction] = useState<{
        type: 'demand' | 'period' | null;
        id?: string;
    }>({ type: null });

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

    const handleDeleteDemand = async (id: string) => {
        if (confirm('⚠️ Tem certeza que deseja excluir esta demanda?')) {
            try {
                await deleteDemand(id);
                setDemands((prev) => prev.filter((d) => d.id !== id));

                toast.success('Demanda excluída com sucesso!'); //Nao funcionou, shadcn disse que estava descontinuado
                //mas com sonner era para funcionar, e bom... nao funcinou
            } catch (error) {
                toast.error('Erro ao escluir demanda');
                console.log(error);
            }
        }
    };

    const handleDeletePeriod = async () => {
        if (
            confirm(
                '⚠️ Tem certeza que deseja excluir este Período? Todas as demandas associadas serão excluídas também!'
            )
        ) {
            try {
                await deletePeriod(periodId);
                toast.success('Período excluído com sucesso!');
                onSave();
                onClose();
            } catch (error) {
                toast.error('Erro ao excluir período');
                console.error(error);
            }
        }
    };

    const handleSave = async () => {
        try {
            for (const demand of demands) {
                await updateDemand(demand.id, {
                    description: demand.description,
                    totalPlan: demand.totalPlan,
                    totalProd: demand.totalProd,
                });
            }
            onSave();
            onClose();
            toast.success('Alterações salvas com sucesso!');
        } catch (err) {
            console.error('Erro ao salvar alterações:', err);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl!">
                <DialogHeader className="border-b-4 border-orange-600 pb-4 mb-6">
                    <DialogTitle className="text-(--laranja) ">Editar Demandas</DialogTitle>

                    <DialogDescription className="text-gray-600">
                        Altere Descrição, total planejado ou/e produzido. O status do período será
                        atualizado automaticamente ao salvar. é possível apagar o período, mas
                        cuidado! Não tem como voltar atrás!
                    </DialogDescription>
                </DialogHeader>

                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="p-3 border-b">SKU</th>
                            <th className="p-3 border-b">Descrição</th>
                            <th className="p-3 border-b">Total Planejado</th>
                            <th className="p-3 border-b">Total Produzidos</th>
                            <th className="p-3 border-b">Remover</th>
                        </tr>
                    </thead>
                    <tbody>
                        {demands.map((demand) => (
                            <tr key={demand.id}>
                                <td className="p-2 border-b">{demand.sku}</td>
                                <td className="p-2 border-b">
                                    <Input
                                        type="string"
                                        value={demand.description}
                                        onChange={(e) =>
                                            handleChange(demand.id, 'description', e.target.value)
                                        }
                                    ></Input>
                                </td>
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
                                        onClick={() => handleDeleteDemand(demand.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex justify-between gap-3 mt-4">
                    <div>
                        <Button
                            variant="outline"
                            onClick={handleDeletePeriod}
                            className="bg-red-600 text-white mr-4"
                        >
                            Apagar Período
                        </Button>
                    </div>
                    <div>
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="bg-red-600 text-white mr-4"
                        >
                            Cancelar
                        </Button>
                        <Button onClick={handleSave} className="bg-green-600 text-white">
                            Salvar
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
