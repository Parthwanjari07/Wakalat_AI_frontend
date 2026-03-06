'use client';

import React, { useEffect, useState } from 'react';
import { useMCPStore, MCPServerConfig } from '@/store/mcpStore';
import { Settings, Wifi, WifiOff, Loader2, CheckCircle2, XCircle, Wrench, Plus, Trash2, Edit3, Save, X, Globe, Terminal, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

type EditingServer = {
  name: string;
  config: MCPServerConfig;
  isNew: boolean;
};

const MCPConnectionPanel: React.FC = () => {
  const {
    status, tools, loadingTools, mcpConfig, activeServer, configLoaded,
    loadConfig, saveConfig, connectServer, disconnect, checkStatus, fetchTools,
    addServer, updateServer, removeServer,
  } = useMCPStore();

  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<EditingServer | null>(null);
  const [newServerName, setNewServerName] = useState('');
  const [tokenEmail, setTokenEmail] = useState('');
  const [generatingToken, setGeneratingToken] = useState(false);
  const [rawConfigText, setRawConfigText] = useState('');
  const [editingRawConfig, setEditingRawConfig] = useState(false);
  const [rawConfigError, setRawConfigError] = useState('');

  useEffect(() => {
    loadConfig();
    checkStatus();
  }, [loadConfig, checkStatus]);

  const handleConnect = async (name: string) => {
    const result = await connectServer(name);
    if (result.connected) {
      toast.success(`Connected to "${name}"`);
    } else {
      toast.error(result.error || 'Failed to connect');
    }
  };

  const handleDisconnect = async () => {
    await disconnect();
    toast.success('Disconnected');
  };

  const handleSaveServer = async () => {
    if (!editing) return;
    const name = editing.isNew ? newServerName.trim() : editing.name;
    if (!name) {
      toast.error('Server name is required');
      return;
    }
    if (editing.isNew) {
      await addServer(name, editing.config);
      toast.success(`Added server "${name}"`);
    } else {
      await updateServer(name, editing.config);
      toast.success(`Updated server "${name}"`);
    }
    setEditing(null);
    setNewServerName('');
  };

  const handleDeleteServer = async (name: string) => {
    await removeServer(name);
    toast.success(`Removed server "${name}"`);
  };

  const handleGenerateToken = async () => {
    if (!editing || !tokenEmail.trim()) {
      toast.error('Enter your email to generate a token');
      return;
    }
    const serverUrl = editing.config.url;
    if (!serverUrl) {
      toast.error('Enter the SSE URL first');
      return;
    }

    setGeneratingToken(true);
    try {
      const res = await fetch('/api/mcp/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: tokenEmail.trim(), serverUrl }),
      });
      const data = await res.json();

      if (data.success && data.access_token) {
        const updatedConfig = {
          ...editing.config,
          headers: { ...editing.config.headers, Authorization: `Bearer ${data.access_token}` },
        };
        setEditing({ ...editing, config: updatedConfig });

        const name = editing.isNew ? newServerName.trim() : editing.name;
        if (name) {
          if (editing.isNew) {
            await addServer(name, updatedConfig);
          } else {
            await updateServer(name, updatedConfig);
          }
        }
        toast.success('Token generated and saved!');
      } else {
        toast.error(data.error || 'Failed to generate token');
      }
    } catch {
      toast.error('Could not reach the server to generate token');
    } finally {
      setGeneratingToken(false);
    }
  };

  const startAddServer = () => {
    setEditing({
      name: '',
      config: { type: 'sse', url: '', headers: { Authorization: 'Bearer ' } },
      isNew: true,
    });
    setNewServerName('');
    setTokenEmail('');
  };

  const startEditServer = (name: string) => {
    const config = mcpConfig.mcpServers[name];
    setEditing({ name, config: { ...config }, isNew: false });
    setTokenEmail('');
  };

  const getStatusIcon = () => {
    if (status.connecting) return <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: 'var(--accent)' }} />;
    if (status.connected) return <CheckCircle2 className="w-3.5 h-3.5" style={{ color: '#5C8A6E' }} />;
    return <XCircle className="w-3.5 h-3.5" style={{ color: '#C4534A' }} />;
  };

  const getStatusText = () => {
    if (status.connecting) return 'Connecting...';
    if (status.connected) return activeServer || 'Connected';
    return 'Disconnected';
  };

  const servers = Object.entries(mcpConfig.mcpServers);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-16 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-xl shadow-lg transition-all"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          color: 'var(--text-secondary)',
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
        title="MCP Connection"
      >
        {getStatusIcon()}
        <span className="text-xs font-medium">{getStatusText()}</span>
        <Settings className="w-3.5 h-3.5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
              style={{ background: 'rgba(0,0,0,0.5)' }}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-28 right-4 z-50 w-[440px] max-h-[80vh] overflow-y-auto rounded-xl card-chamber p-5"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-serif text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  MCP Servers
                </h3>
                <div className="flex items-center gap-1">
                  <button onClick={startAddServer} className="p-1.5 rounded-lg transition-colors btn-ghost" title="Add server">
                    <Plus className="w-4 h-4" style={{ color: '#5C8A6E' }} />
                  </button>
                  <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg transition-colors btn-ghost">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Server List */}
              {!configLoaded ? (
                <div className="text-center py-6">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" style={{ color: 'var(--text-tertiary)' }} />
                  <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>Loading config...</p>
                </div>
              ) : servers.length === 0 && !editing ? (
                <div className="text-center py-8">
                  <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>No MCP servers configured</p>
                  <button onClick={startAddServer} className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
                    Add your first server
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {servers.map(([name, config]) => {
                    const isActive = activeServer === name && status.connected;
                    return (
                      <div
                        key={name}
                        className="p-3.5 rounded-xl transition-colors"
                        style={{
                          background: 'var(--bg-tertiary)',
                          border: `1px solid ${isActive ? '#5C8A6E40' : 'var(--border)'}`,
                        }}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            {config.type === 'sse' ? (
                              <Globe className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                            ) : (
                              <Terminal className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                            )}
                            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{name}</span>
                            <span
                              className="text-[9px] px-1.5 py-0.5 rounded-md uppercase font-semibold tracking-wider"
                              style={{ background: 'var(--accent-subtle)', color: 'var(--accent)' }}
                            >
                              {config.type}
                            </span>
                          </div>
                          <div className="flex items-center gap-0.5">
                            <button onClick={() => startEditServer(name)} className="p-1 rounded-md transition-colors btn-ghost" title="Edit">
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button onClick={() => handleDeleteServer(name)} className="p-1 rounded-md transition-colors btn-ghost" title="Remove">
                              <Trash2 className="w-3 h-3" style={{ color: '#C4534A' }} />
                            </button>
                          </div>
                        </div>

                        <p className="text-xs mb-2.5 truncate" style={{ color: 'var(--text-tertiary)' }}>
                          {config.type === 'sse' ? config.url : `${config.command} ${(config.args || []).join(' ')}`}
                        </p>

                        {isActive ? (
                          <button
                            onClick={handleDisconnect}
                            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-white transition-colors"
                            style={{ background: '#C4534A' }}
                          >
                            <WifiOff className="w-3 h-3" /> Disconnect
                          </button>
                        ) : (
                          <button
                            onClick={() => handleConnect(name)}
                            disabled={status.connecting}
                            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-white transition-colors disabled:opacity-50"
                            style={{ background: '#5C8A6E' }}
                          >
                            {status.connecting ? (
                              <><Loader2 className="w-3 h-3 animate-spin" /> Connecting...</>
                            ) : (
                              <><Wifi className="w-3 h-3" /> Connect</>
                            )}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Edit / Add Server Form */}
              {editing && (
                <div className="mt-4 p-4 rounded-xl" style={{ background: 'var(--accent-subtle)', border: '1px solid color-mix(in srgb, var(--accent) 20%, transparent)' }}>
                  <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                    {editing.isNew ? 'Add Server' : `Edit "${editing.name}"`}
                  </h4>

                  {editing.isNew && (
                    <div className="mb-3">
                      <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Server Name</label>
                      <input
                        type="text" value={newServerName} onChange={(e) => setNewServerName(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg input-chamber" placeholder="my-mcp-server"
                      />
                    </div>
                  )}

                  {/* Transport type */}
                  <div className="mb-3">
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Transport</label>
                    <div className="flex gap-2">
                      {(['sse', 'stdio'] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => setEditing({
                            ...editing,
                            config: t === 'sse'
                              ? { type: 'sse', url: '', headers: { Authorization: 'Bearer ' } }
                              : { type: 'stdio', command: 'uv', args: ['run', 'main.py'], cwd: '' },
                          })}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
                          style={{
                            background: editing.config.type === t ? 'var(--accent)' : 'var(--bg-tertiary)',
                            color: editing.config.type === t ? '#0C0B09' : 'var(--text-secondary)',
                            border: `1px solid ${editing.config.type === t ? 'var(--accent)' : 'var(--border)'}`,
                          }}
                        >
                          {t === 'sse' ? <Globe className="w-3 h-3" /> : <Terminal className="w-3 h-3" />}
                          {t === 'sse' ? 'Remote (SSE)' : 'Local (stdio)'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SSE fields */}
                  {editing.config.type === 'sse' && (
                    <>
                      <div className="mb-3">
                        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>SSE URL</label>
                        <input
                          type="text"
                          value={editing.config.url || ''}
                          onChange={(e) => setEditing({ ...editing, config: { ...editing.config, url: e.target.value } })}
                          className="w-full px-3 py-2 text-sm rounded-lg input-chamber"
                          placeholder="https://your-server.com/sse"
                        />
                      </div>

                      {/* Token */}
                      <div className="mb-3 p-3 rounded-lg" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
                        <div className="flex items-center gap-1.5 mb-2">
                          <Key className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                          <span className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>Access Token</span>
                        </div>
                        <p className="text-[11px] mb-2" style={{ color: 'var(--text-tertiary)' }}>
                          Enter your email to generate a token, or paste an existing one.
                        </p>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="email" value={tokenEmail} onChange={(e) => setTokenEmail(e.target.value)}
                            className="flex-1 px-2.5 py-1.5 text-xs rounded-lg input-chamber" placeholder="you@email.com"
                          />
                          <button
                            onClick={handleGenerateToken}
                            disabled={generatingToken || !tokenEmail.trim() || !editing.config.url}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-50 btn-brass"
                          >
                            {generatingToken ? <Loader2 className="w-3 h-3 animate-spin" /> : <Key className="w-3 h-3" />}
                            Generate
                          </button>
                        </div>
                        <input
                          type="text"
                          value={editing.config.headers?.Authorization || ''}
                          onChange={(e) => setEditing({
                            ...editing,
                            config: { ...editing.config, headers: { ...editing.config.headers, Authorization: e.target.value } },
                          })}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg font-mono input-chamber"
                          placeholder="Bearer eyJ..."
                        />
                      </div>
                    </>
                  )}

                  {/* Stdio fields */}
                  {editing.config.type === 'stdio' && (
                    <>
                      <div className="mb-2 p-2.5 rounded-lg" style={{ background: '#5C8A6E15', border: '1px solid #5C8A6E30' }}>
                        <p className="text-[11px]" style={{ color: '#5C8A6E' }}>
                          Local stdio connections don&apos;t require authentication.
                        </p>
                      </div>
                      <div className="mb-3">
                        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Command</label>
                        <input
                          type="text"
                          value={editing.config.command || ''}
                          onChange={(e) => setEditing({ ...editing, config: { ...editing.config, command: e.target.value } })}
                          className="w-full px-3 py-2 text-sm rounded-lg input-chamber" placeholder="uv"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Args (comma-separated)</label>
                        <input
                          type="text"
                          value={(editing.config.args || []).join(', ')}
                          onChange={(e) => setEditing({ ...editing, config: { ...editing.config, args: e.target.value.split(',').map(s => s.trim()) } })}
                          className="w-full px-3 py-2 text-sm rounded-lg input-chamber" placeholder="run, main.py"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Working Directory</label>
                        <input
                          type="text"
                          value={editing.config.cwd || ''}
                          onChange={(e) => setEditing({ ...editing, config: { ...editing.config, cwd: e.target.value } })}
                          className="w-full px-3 py-2 text-sm rounded-lg input-chamber" placeholder="/path/to/backend"
                        />
                      </div>
                    </>
                  )}

                  <div className="flex gap-2">
                    <button onClick={handleSaveServer} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all btn-brass">
                      <Save className="w-3 h-3" /> Save
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                      style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Connected Tools */}
              {status.connected && tools.length > 0 && (
                <div className="mt-4 p-3.5 rounded-xl" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
                  <div className="flex items-center gap-2 mb-2.5">
                    <Wrench className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {tools.length} Tools Available
                    </span>
                    {loadingTools && <Loader2 className="w-3 h-3 animate-spin" style={{ color: 'var(--text-tertiary)' }} />}
                    <button onClick={fetchTools} disabled={loadingTools} className="ml-auto text-xs font-medium disabled:opacity-50" style={{ color: 'var(--accent)' }}>
                      Refresh
                    </button>
                  </div>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {tools.map((tool, i) => (
                      <div key={i} className="p-2.5 rounded-lg" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                        <div className="font-medium text-xs" style={{ color: 'var(--text-primary)' }}>{tool.name}</div>
                        {tool.description && (
                          <div className="text-[11px] mt-0.5 line-clamp-2" style={{ color: 'var(--text-tertiary)' }}>{tool.description}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Raw Config Editor */}
              <details className="mt-4" onToggle={(e) => {
                if ((e.target as HTMLDetailsElement).open && !editingRawConfig) {
                  setRawConfigText(JSON.stringify(mcpConfig, null, 2));
                  setRawConfigError('');
                }
              }}>
                <summary className="text-xs cursor-pointer transition-colors" style={{ color: 'var(--text-tertiary)' }}>
                  Edit mcp.json
                </summary>
                <div className="mt-2">
                  <textarea
                    value={editingRawConfig ? rawConfigText : JSON.stringify(mcpConfig, null, 2)}
                    onChange={(e) => {
                      setEditingRawConfig(true);
                      setRawConfigText(e.target.value);
                      setRawConfigError('');
                    }}
                    className="w-full p-3 text-[11px] rounded-lg font-mono resize-y min-h-[120px] max-h-[300px] input-chamber"
                    spellCheck={false}
                  />
                  {rawConfigError && (
                    <p className="text-[11px] mt-1" style={{ color: '#C4534A' }}>{rawConfigError}</p>
                  )}
                  {editingRawConfig && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={async () => {
                          try {
                            const parsed = JSON.parse(rawConfigText);
                            if (!parsed.mcpServers || typeof parsed.mcpServers !== 'object') {
                              setRawConfigError('Config must have a "mcpServers" object');
                              return;
                            }
                            await saveConfig(parsed);
                            setEditingRawConfig(false);
                            setRawConfigError('');
                            toast.success('mcp.json saved');
                          } catch (e) {
                            setRawConfigError(e instanceof SyntaxError ? `Invalid JSON: ${e.message}` : 'Failed to save');
                          }
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all btn-brass"
                      >
                        <Save className="w-3 h-3" /> Save mcp.json
                      </button>
                      <button
                        onClick={() => {
                          setEditingRawConfig(false);
                          setRawConfigText(JSON.stringify(mcpConfig, null, 2));
                          setRawConfigError('');
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                        style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </details>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MCPConnectionPanel;
