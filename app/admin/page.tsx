"use client";

import { useEffect, useState } from "react";

type OlistOrder = {
  id: number;
  numero?: string;
  data_pedido?: string;
  situacao?: string;
  cliente?: { nome?: string; email?: string; telefone?: string };
  itens?: Array<{ nome?: string; quantidade?: number; valorUnitario?: number }>;
  "valor-total"?: number;
  enderecoEntrega?: {
    endereco?: string;
    cidade?: string;
    uf?: string;
    cep?: string;
  };
};

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  "Aberto": { label: "Aberto", color: "bg-yellow-100 text-yellow-800" },
  "Faturado": { label: "Faturado", color: "bg-blue-100 text-blue-800" },
  "Cancelado": { label: "Cancelado", color: "bg-red-100 text-red-800" },
  "Aprovado": { label: "Aprovado", color: "bg-green-100 text-green-800" },
  "Preparando Envio": { label: "Preparando Envio", color: "bg-purple-100 text-purple-800" },
  "Enviado": { label: "Enviado", color: "bg-indigo-100 text-indigo-800" },
  "Entregue": { label: "Entregue", color: "bg-emerald-100 text-emerald-800" },
};

export default function AdminPage() {
  const [orders, setOrders] = useState<OlistOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OlistOrder | null>(null);

  const fetchOrders = async (authToken: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/orders", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.status === 401) {
        setError("Token inválido");
        setAuthenticated(false);
        return;
      }
      const data = await res.json();
      setOrders(data.orders || []);
      setAuthenticated(true);
    } catch {
      setError("Erro ao buscar pedidos");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders(token);
  };

  useEffect(() => {
    const saved = localStorage.getItem("admin-token");
    if (saved) {
      setToken(saved);
      fetchOrders(saved);
    }
  }, []);

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Painel Administrativo
          </h1>
          <p className="text-gray-500 text-sm text-center mb-6">
            Perfumaria Suanne — Gestão de Pedidos Olist
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Token de Acesso
              </label>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Digite o token admin"
              />
            </div>
            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition-colors font-medium"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Pedidos Olist
            </h1>
            <p className="text-gray-500 mt-1">
              Perfumaria Suanne — Gestão de Vendas
            </p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("admin-token");
              setAuthenticated(false);
              setOrders([]);
            }}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Sair
          </button>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto" />
            <p className="text-gray-500 mt-4">Carregando pedidos...</p>
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <p className="text-gray-500 text-lg">Nenhum pedido encontrado</p>
            <p className="text-gray-400 text-sm mt-2">
              Os pedidos aparecerão aqui quando forem criados via Mercado Pago
            </p>
          </div>
        )}

        {orders.length > 0 && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pedido
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Itens
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order) => {
                    const statusInfo = STATUS_MAP[order.situacao || ""] || {
                      label: order.situacao || "Desconhecido",
                      color: "bg-gray-100 text-gray-800",
                    };
                    return (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-mono text-sm text-gray-900">
                            #{order.id}
                          </span>
                          {order.numero && (
                            <span className="ml-2 text-xs text-gray-500">
                              ({order.numero})
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {order.cliente?.nome || "N/A"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.cliente?.email || ""}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {(order.itens || []).map((item, i) => (
                            <div key={i} className="text-sm text-gray-700">
                              {item.quantidade}x {item.nome}
                            </div>
                          ))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">
                            R$ {(order["valor-total"] || 0).toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}
                          >
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.data_pedido || "N/A"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Order detail modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Pedido #{selectedOrder.id}
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700 mb-1">Cliente</h3>
                  <p className="text-sm text-gray-600">{selectedOrder.cliente?.nome}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.cliente?.email}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.cliente?.telefone}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 mb-1">Endereço</h3>
                  <p className="text-sm text-gray-600">
                    {selectedOrder.enderecoEntrega?.endereco},{' '}
                    {selectedOrder.enderecoEntrega?.cidade}/
                    {selectedOrder.enderecoEntrega?.uf} —{' '}
                    CEP: {selectedOrder.enderecoEntrega?.cep}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 mb-1">Itens</h3>
                  {(selectedOrder.itens || []).map((item, i) => (
                    <div key={i} className="flex justify-between text-sm text-gray-600 py-1 border-b border-gray-100">
                      <span>{item.quantidade}x {item.nome}</span>
                      <span>R$ {((item.valorUnitario || 0) * (item.quantidade || 1)).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm font-medium text-gray-900 pt-2">
                    <span>Total</span>
                    <span>R$ {(selectedOrder["valor-total"] || 0).toFixed(2)}</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 mb-1">Status</h3>
                  <span
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      STATUS_MAP[selectedOrder.situacao || ""]?.color || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {STATUS_MAP[selectedOrder.situacao || ""]?.label || selectedOrder.situacao}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
