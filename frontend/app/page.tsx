'use client';
//React
import React from 'react';
import { useState, useEffect } from 'react';

//API
import { getAllPeriods } from '@/lib/api';

//Compoents
import CreatePeriodModal from '@/components/createPeriodModal';

//Estilização
import { Button } from '@/components/ui/button';
import { CiCirclePlus } from 'react-icons/ci';
import { FaEdit } from 'react-icons/fa';
import { IoMdAdd } from 'react-icons/io';

interface Period {
    id: number;
    startDate: string;
    endDate: string;
    demands?: { sku: string }[];
    sku: string;
    totalPlan: number;
    totalProd: number;
    status: string;
}

export default function Home() {
    const [periods, setPeriods] = useState<Period[]>([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        async function loadPeriods() {
            try {
                const data = await getAllPeriods();
                setPeriods(data);
            } catch (error) {
                console.error('Erro ao carregar os períodos:', error);
            } finally {
                setLoading(false);
            }
        }

        loadPeriods();
    }, []);

    // função para formatar as datas, no backend estão em um formato n muito legível com fuso horari oe etc
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0].replace(/-/g, '/'); // 2022/05/23
    };

    const handleCreated = async () => {
        const data = await getAllPeriods();
        setPeriods(data);
    };

    if (loading)
        return (
            <div className="flex text-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <p className="">Carregando... </p>
                <p className="loader ml-4"></p>
            </div>
        );

    return (
        <div>
            <h1 className="text-2xl font-bold">DEMANDAS DE PRODUÇÃO DE LATINHAS</h1>

            <CreatePeriodModal onCreated={handleCreated}></CreatePeriodModal>

            {/* Optei por fazer uma tabela mais semantica em HTML mesmo, mas no modal usei SHADCN */}
            <table className="w-full border border-gray-300 rounded-lg shadow-sm">
                <thead>
                    <tr className="bg-(--preto-claro3)">
                        <th className="p-3 border-b">Editar</th>
                        <th className="p-3 border-b">Periodo</th>
                        <th className="p-3 border-b">SKUs</th>
                        <th className="p-3 border-b">Total Plan</th>
                        <th className="p-3 border-b">Total Prod</th>
                        <th className="p-3 border-b">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {periods.map((period) => (
                        <tr
                            key={period.id}
                            className="border-b hover:bg-gray-50 transition text-center"
                        >
                            {/* Botão de ediçtar período */}
                            <td className="p-3 flex justify-center">
                                <button
                                    className="text-blue-600 hover:underline"
                                    onClick={() => console.log(`Editar período ${period.id}`)}
                                >
                                    <FaEdit size={22}></FaEdit>
                                </button>
                            </td>

                            {/* Período formatado para uma data mais 'visual', no backend ta com padrao de fuso horars*/}
                            <td className="p-3">
                                {formatDate(period.startDate)} - {formatDate(period.endDate)}
                            </td>

                            {/* Quantidade de SKUs */}

                            <td className="p-3">{period.demands ? period.demands.length : 0}</td>

                            {/* Totais */}
                            <td className="p-3">{period.totalPlan}</td>
                            <td className="p-3">{period.totalProd}</td>
                            <td
                                className={`p-3 font-semibold  ${
                                    period.status === 'CONCLUIDO'
                                        ? 'text-green-600 bg-lime-200'
                                        : period.status === 'EM ANDAMENTO'
                                        ? 'text-blue-600 bg-cyan-200'
                                        : 'text-gray-500 bg-red-200'
                                }`}
                            >
                                {period.status}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
