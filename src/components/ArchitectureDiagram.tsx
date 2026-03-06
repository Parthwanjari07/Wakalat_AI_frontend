'use client'

import { Tldraw, createShapeId, type Editor } from 'tldraw'
import 'tldraw/tldraw.css'

export default function ArchitectureDiagram() {
  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <Tldraw
        onMount={(editor) => {
          createDiagram(editor)
          editor.zoomToFit()
          editor.setCurrentTool('hand')
        }}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Rich text helper (tldraw v4 uses ProseMirror richText format)      */
/* ------------------------------------------------------------------ */

interface RichText {
  type: 'doc'
  content: Array<{ type: 'paragraph'; content?: Array<{ type: 'text'; text: string }> }>
}

function rt(text: string): RichText {
  return {
    type: 'doc',
    content: text.split('\n').map((line) =>
      line
        ? { type: 'paragraph' as const, content: [{ type: 'text' as const, text: line }] }
        : { type: 'paragraph' as const }
    ),
  }
}

const EMPTY_RT = rt('')

/* ------------------------------------------------------------------ */
/*  Shape helpers                                                      */
/* ------------------------------------------------------------------ */

type Color = 'black' | 'grey' | 'light-violet' | 'violet' | 'blue' | 'light-blue' |
  'yellow' | 'orange' | 'green' | 'light-green' | 'light-red' | 'red'

function geo(
  id: string, x: number, y: number, w: number, h: number,
  text: string, color: Color, fill: 'none' | 'semi' | 'solid' = 'solid',
  size: 's' | 'm' | 'l' | 'xl' = 's',
) {
  return {
    id: createShapeId(id),
    type: 'geo' as const,
    x, y,
    props: {
      w, h, color, fill,
      richText: text ? rt(text) : EMPTY_RT,
      geo: 'rectangle' as const,
      font: 'sans' as const,
      size,
      align: 'middle' as const,
      verticalAlign: 'middle' as const,
    },
  }
}

function label(
  id: string, x: number, y: number, text: string,
  color: Color = 'black', size: 's' | 'm' | 'l' | 'xl' = 'l',
) {
  return {
    id: createShapeId(id),
    type: 'text' as const,
    x, y,
    props: {
      richText: rt(text),
      color,
      font: 'mono' as const,
      size,
      w: 10,
      autoSize: true,
      textAlign: 'start' as const,
    },
  }
}

function arrow(
  id: string, x1: number, y1: number, x2: number, y2: number,
  text: string = '', color: Color = 'grey',
) {
  return {
    id: createShapeId(id),
    type: 'arrow' as const,
    x: x1, y: y1,
    props: {
      start: { x: 0, y: 0 },
      end: { x: x2 - x1, y: y2 - y1 },
      color,
      arrowheadStart: 'none' as const,
      arrowheadEnd: 'arrow' as const,
      richText: text ? rt(text) : EMPTY_RT,
      font: 'sans' as const,
      size: 's' as const,
    },
  }
}

/* ------------------------------------------------------------------ */
/*  Diagram builder                                                    */
/* ------------------------------------------------------------------ */

function createDiagram(editor: Editor) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editor.createShapes([

    // ===================== TITLE =====================
    label('title', 280, -50, 'WAKALAT-AI  SYSTEM  ARCHITECTURE', 'black', 'xl'),

    // ===================== USER BROWSER =====================
    geo('user', 250, 40, 900, 90,
      'USER (Browser)\nText Query  |  Guided Form (Criminal / Civil / Cybercrime / Family)  |  Document Upload',
      'light-blue', 'solid', 's'),

    // ===================== NEXT.JS FRONTEND =====================
    geo('fe-bg', 0, 180, 1400, 800, '', 'blue', 'semi'),
    label('fe-label', 20, 185, 'NEXT.JS 16 FRONTEND', 'blue', 'l'),

    // -- UI Components row --
    geo('components', 30, 240, 1340, 80,
      'UI Components\nInputArea (3 modes)  |  ChatMessage  |  StreamingChatMessage  |  ToolCallLogs  |  Sidebar',
      'light-blue', 'solid', 's'),

    // -- Zustand Stores row --
    geo('stores', 30, 350, 1340, 80,
      'Zustand State Management\nchatStore  |  formStore  |  mcpStore  |  sidebarStore  |  authModalStore',
      'blue', 'solid', 's'),

    // -- API Routes row --
    geo('api-routes', 30, 460, 1340, 80,
      'Next.js API Routes (Server-Side)\n/api/gemini/stream  |  /api/gemini/chat  |  /api/mcp/connect  |  /api/mcp/tools  |  /api/chats',
      'light-blue', 'solid', 's'),

    // -- Orchestration Layer --
    label('orch-label', 30, 555, 'Orchestration Layer', 'orange', 'm'),

    geo('legal-asst', 30, 590, 430, 110,
      'legal-assistant.ts\n\nSystem prompt builder\nTool instructions injection\nSSE event streaming',
      'orange', 'solid', 's'),

    geo('gemini-agent', 490, 590, 430, 110,
      'gemini-agent.ts\n\nAgentic loop (max 5 iter / 300s)\nGemini 2.5 Flash\nNative function calling',
      'orange', 'solid', 's'),

    geo('mcp-client', 950, 590, 420, 110,
      'mcp-client.ts\n\nstdio / SSE transport\nMCP protocol client\n2-min tool timeout',
      'orange', 'solid', 's'),

    // -- Database & Auth --
    geo('db', 30, 740, 520, 80,
      'Prisma ORM  ->  PostgreSQL\nChat & Message persistence (fire-and-forget)',
      'violet', 'solid', 's'),

    geo('auth', 580, 740, 400, 80,
      'NextAuth\nSession management  |  Protected routes',
      'violet', 'solid', 's'),

    // ===================== MCP PROTOCOL GAP =====================
    label('mcp-proto', 520, 1000, 'MCP Protocol\n(stdio / SSE)', 'grey', 'm'),

    // ===================== PYTHON MCP BACKEND =====================
    geo('be-bg', 0, 1080, 1400, 730, '', 'green', 'semi'),
    label('be-label', 20, 1085, 'PYTHON MCP BACKEND', 'green', 'l'),

    // -- Servers row --
    geo('srv-stdio', 30, 1130, 660, 100,
      'server.py  (stdio MCP)\n\n@list_tools()  |  @call_tool()\n@list_resources()  |  @list_prompts()',
      'light-green', 'solid', 's'),

    geo('srv-http', 710, 1130, 660, 100,
      'http_server.py  (FastAPI)\n\n/tools/execute  |  /sse  |  /ws\nJWT Auth (HS256, 30-day expiry)',
      'light-green', 'solid', 's'),

    // -- Tools label --
    label('tools-hdr', 30, 1245, 'Legal Tools', 'yellow', 'm'),

    // -- Production tools --
    geo('t-precedent', 30, 1280, 430, 90,
      'search_precedents  [LIVE]\n\nFirecrawl API -> IndianKanoon\nJurisdiction + year filtering',
      'yellow', 'solid', 's'),

    geo('t-research', 480, 1280, 430, 90,
      'deep_research  [LIVE]\n\n4-step Gemini + Firecrawl pipeline\nDecompose -> Crawl -> Extract -> Synthesize',
      'yellow', 'solid', 's'),

    geo('t-limitation', 930, 1280, 440, 90,
      'check_limitation  [LIVE]\n\nDeterministic calculation\nLimitation Act 1963  (28+ case types)',
      'yellow', 'solid', 's'),

    // -- Stub tools --
    geo('t-caselaw', 30, 1400, 320, 80,
      'case_law_finder\nPostgreSQL pgvector search',
      'light-green', 'semi', 's'),

    geo('t-legalres', 370, 1400, 320, 80,
      'legal_research\nLLM-based with citations',
      'light-green', 'semi', 's'),

    geo('t-docanalyze', 710, 1400, 320, 80,
      'document_analyzer\nPDF/DOCX + LLM analysis',
      'light-green', 'semi', 's'),

    geo('t-draft', 1050, 1400, 320, 80,
      'draft_legal_notice\nLLM document generation',
      'light-green', 'semi', 's'),

    // -- Services label --
    label('svc-hdr', 30, 1500, 'Services & Config', 'green', 'm'),

    // -- Services row --
    geo('chromadb', 30, 1540, 430, 80,
      'ChromaDB Vector Store\nSemantic search  |  MiniLM-L6-v2 embeddings',
      'light-green', 'solid', 's'),

    geo('llm', 480, 1540, 430, 80,
      'llm.py  (Shared LLM Helper)\nGemini -> OpenAI -> Anthropic fallback chain',
      'light-green', 'solid', 's'),

    geo('config', 930, 1540, 440, 80,
      'config.py  (Pydantic Settings)\nFeature flags  |  API keys  |  CORS  |  Rate limits',
      'light-green', 'solid', 's'),

    // ===================== EXTERNAL SERVICES =====================
    label('ext-hdr', 400, 1830, 'External Services', 'red', 'm'),

    geo('firecrawl', 200, 1870, 420, 80,
      'Firecrawl API\nWeb scraping service',
      'red', 'semi', 's'),

    geo('indiankanoon', 700, 1870, 420, 80,
      'Indian Kanoon\nLegal database  (indiankanoon.org)',
      'red', 'semi', 's'),

    // ===================== ARROWS =====================

    // User -> Frontend
    arrow('a1', 700, 130, 700, 180, '', 'blue'),

    // Components -> Stores
    arrow('a2', 700, 320, 700, 350, '', 'blue'),

    // Stores -> API Routes
    arrow('a3', 700, 430, 700, 460, '', 'blue'),

    // API Routes -> Orchestration (center)
    arrow('a4', 700, 540, 700, 590, '', 'orange'),

    // legal-assistant -> gemini-agent (horizontal)
    arrow('a5', 460, 645, 490, 645, '', 'orange'),

    // gemini-agent -> mcp-client (horizontal)
    arrow('a6', 920, 645, 950, 645, '', 'orange'),

    // Frontend -> Backend (MCP Protocol)
    arrow('a7', 700, 980, 700, 1080, 'MCP', 'green'),

    // Servers -> Tools
    arrow('a8', 700, 1230, 700, 1280, '', 'green'),

    // Stub tools -> Services
    arrow('a9', 700, 1480, 700, 1540, '', 'green'),

    // Backend -> Firecrawl
    arrow('a10', 410, 1810, 410, 1870, '', 'red'),

    // Backend -> Indian Kanoon
    arrow('a11', 910, 1810, 910, 1870, '', 'red'),

    // Stores -> DB (diagonal)
    arrow('a12', 300, 430, 280, 740, '', 'violet'),

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ] as any)
}
