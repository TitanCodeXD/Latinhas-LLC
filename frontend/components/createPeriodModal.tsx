'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
//API
import { addPeriod } from '@/lib/api';

//Estilização
import { CiCirclePlus } from 'react-icons/ci';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

interface Demand {
    sku: string;
    description?: string;
    totalPlan: number;
}

export default function CreatePeriodModal({ onCreated }: { onCreated: () => void }) {
    const [open, setOpen] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [demands, setDemands] = useState<Demand[]>([{ sku: '', description: '', totalPlan: 0 }]);

    const handleChangeDemand = (index: number, field: keyof Demand, value: string | number) => {
        const updated = [...demands];
        if (field === 'totalPlan') {
            updated[index][field] = Number(value);
        } else {
            updated[index][field] = value as string;
        }
        setDemands(updated);
    };

    const addDemand = () => {
        setDemands([...demands, { sku: '', description: '', totalPlan: 0 }]);
    };

    const removeDemand = (index: number) => {
        setDemands(demands.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        try {
            await addPeriod({ startDate, endDate, demands });
            setOpen(false);
            setStartDate('');
            setEndDate('');
            setDemands([{ sku: '', description: '', totalPlan: 0 }]);
            onCreated(); // para pagian iniciall
        } catch (error) {
            console.error('Erro ao criar período:', error);
        }
    };

    //para evitar que os dados fique msalvos mesmo apos fechar e abrir novamente
    //adição simples que n muda mt coisa, macho interessante
    const resetForm = () => {
        setStartDate('');
        setEndDate('');
        setDemands([{ sku: '', description: '', totalPlan: 0 }]);
    };

    const handleClose = () => {
        setOpen(false);
        resetForm();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default" className="bg-(--laranja) mt-4 mb-4 cursor-pointer">
                    <CiCirclePlus className="mr-2" /> Adicionar
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Criar Novo Período</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4 mt-4">
                    <div className="flex gap-4">
                        <div className="flex flex-col w-1/2">
                            <label>Data de Início</label>
                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col w-1/2">
                            <label>Data de Término</label>
                            <Input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <h3 className="text-lg font-semibold mt-2">Demandas</h3>

                    {demands.map((demand, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 border p-2 rounded-md bg-gray-50"
                        >
                            <Input
                                placeholder="SKU"
                                value={demand.sku}
                                onChange={(e) => handleChangeDemand(index, 'sku', e.target.value)}
                                className="w-1/3"
                            />
                            <Input
                                placeholder="Descrição (opcional)"
                                value={demand.description}
                                onChange={(e) =>
                                    handleChangeDemand(index, 'description', e.target.value)
                                }
                                className="w-1/2"
                            />
                            <Input
                                type="number"
                                placeholder="Total Planejado"
                                value={demand.totalPlan}
                                onChange={(e) =>
                                    handleChangeDemand(index, 'totalPlan', e.target.value)
                                }
                                className="w-1/4"
                            />
                            <Button
                                variant="destructive"
                                onClick={() => removeDemand(index)}
                                disabled={demands.length === 1}
                            >
                                Remover
                            </Button>
                        </div>
                    ))}

                    <Button onClick={addDemand} variant="outline">
                        + Adicionar SKU
                    </Button>

                    <div className="flex justify-end mt-4">
                        <Button onClick={handleClose} className="bg-red-600 text-white mr-4">
                            Cancelar
                        </Button>
                        <Button onClick={handleSubmit} className="bg-green-600 text-white">
                            Salvar
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
