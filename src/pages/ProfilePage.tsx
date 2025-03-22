import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, changeUserPassword, updateUserDisplayName } from '@/lib/firebase';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Estados para mudança de senha
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changing, setChanging] = useState(false);
  
  // Estados para atualização de nome
  const [displayName, setDisplayName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [updatingName, setUpdatingName] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setDisplayName(currentUser.displayName || '');
      } else {
        // Redirecionar para login se não estiver autenticado
        navigate('/login');
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [navigate]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (newPassword.length < 6) {
      toast.error("A nova senha deve ter pelo menos 6 caracteres");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }
    
    try {
      setChanging(true);
      await changeUserPassword(currentPassword, newPassword);
      toast.success("Senha alterada com sucesso!");
      
      // Limpar campos
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error("Erro ao alterar senha:", error);
      toast.error(error.message || "Erro ao alterar senha. Tente novamente.");
    } finally {
      setChanging(false);
    }
  };

  const handleUpdateName = async () => {
    if (!displayName.trim()) {
      toast.error("O nome não pode estar vazio");
      return;
    }
    
    try {
      setUpdatingName(true);
      await updateUserDisplayName(displayName);
      toast.success("Nome atualizado com sucesso!");
      setIsEditingName(false);
      
      // Atualizar o estado do usuário
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUser({ ...currentUser });
      }
    } catch (error: any) {
      console.error("Erro ao atualizar nome:", error);
      toast.error(error.message || "Erro ao atualizar nome. Tente novamente.");
    } finally {
      setUpdatingName(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex justify-center flex-grow">
          <div className="w-full max-w-md text-center">
            <p>Carregando...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="w-full max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-french-dark mb-6">Meu Perfil</h1>
          
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="account">Conta</TabsTrigger>
              <TabsTrigger value="password">Segurança</TabsTrigger>
            </TabsList>
            
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Informações da Conta</CardTitle>
                  <CardDescription>
                    Visualize e gerencie suas informações de perfil.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <div className="flex gap-2 items-center">
                      <Input 
                        id="name" 
                        value={displayName} 
                        onChange={(e) => setDisplayName(e.target.value)}
                        disabled={!isEditingName}
                        placeholder="Seu nome completo"
                      />
                      {isEditingName ? (
                        <div className="flex gap-2">
                          <Button 
                            onClick={handleUpdateName} 
                            disabled={updatingName}
                            className="bg-french-blue hover:bg-french-lightBlue"
                          >
                            {updatingName ? 'Salvando...' : 'Salvar'}
                          </Button>
                          <Button 
                            onClick={() => {
                              setIsEditingName(false);
                              setDisplayName(user?.displayName || '');
                            }}
                            variant="outline"
                          >
                            Cancelar
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          onClick={() => setIsEditingName(true)}
                          variant="outline"
                        >
                          Editar
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      value={user?.email || ''} 
                      disabled 
                      readOnly
                    />
                    <p className="text-xs text-gray-500">
                      O email não pode ser alterado, pois é usado como identificador da sua conta.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Data de criação da conta</Label>
                    <p className="text-sm text-gray-500">
                      {user?.metadata?.creationTime 
                        ? new Date(user.metadata.creationTime).toLocaleDateString('pt-BR') 
                        : 'Não disponível'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Alterar Senha</CardTitle>
                  <CardDescription>
                    Atualize sua senha para manter sua conta segura.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Senha Atual</Label>
                      <Input 
                        id="current-password" 
                        type="password" 
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nova Senha</Label>
                      <Input 
                        id="new-password" 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                      <p className="text-xs text-gray-500">
                        Sua senha deve ter pelo menos 6 caracteres.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                      <Input 
                        id="confirm-password" 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-french-blue hover:bg-french-lightBlue"
                      disabled={changing}
                    >
                      {changing ? 'Alterando...' : 'Alterar Senha'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage; 