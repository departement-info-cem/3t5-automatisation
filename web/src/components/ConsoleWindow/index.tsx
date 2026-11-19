import React, { ReactNode } from "react";
import { Highlight, themes as prismThemes } from "prism-react-renderer";
import type { Language } from "prism-react-renderer";
import styles from "./ConsoleWindow.module.css";

interface ConsoleWindowProps {
  children?: ReactNode;
  text?: string;
  title?: string;
  noCopy?: string;
  backgroundColor?: string;
  foregroundColor?: string;
  titleBackgroundColor?: string;
  titleForegroundColor?: string;
  language?: string;
  wrap?: "word" | "character" | "none";
}

function toPlainText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") {
    return "";
  }

  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node
      .map((child) => toPlainText(child))
      .filter((part) => part.length > 0)
      .join("\n");
  }

  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    if (node.type === "br") {
      return "\n";
    }

    const value = toPlainText(node.props.children);
    const blockLike = new Set(["p", "div", "section", "article", "li"]);

    if (typeof node.type === "string" && blockLike.has(node.type)) {
      return `${value}\n`;
    }

    return value;
  }

  return "";
}

function normalizeConsoleText(input: string): string {
  const trimmed = input.replace(/\r\n?/g, "\n").replace(/^\n+|\n+$/g, "");
  const lines = trimmed.split("\n");

  const nonEmptyLines = lines.filter((line) => line.trim().length > 0);
  if (nonEmptyLines.length === 0) {
    return "";
  }

  const minIndent = nonEmptyLines.reduce((min, line) => {
    const indent = line.match(/^\s*/)?.[0].length ?? 0;
    return Math.min(min, indent);
  }, Number.POSITIVE_INFINITY);

  return lines.map((line) => line.slice(minIndent)).join("\n");
}

interface ColorRange {
  start: number;
  end: number;
  color: string;
}

function parseConsoleColors(input: string): { content: string; colors: ColorRange[] } {
  // A pair of markers may surround part of a line or several complete lines.
  const marker = /¶\((#[\da-f]{3,4}|#[\da-f]{6}(?:[\da-f]{2})?|[a-z]+|(?:rgba?|hsla?)\([^()\r\n]*\))\)([^¶]*)¶/gi;
  const colors: ColorRange[] = [];
  let content = "";
  let cursor = 0;

  for (const match of input.matchAll(marker)) {
    content += input.slice(cursor, match.index);
    const start = content.length;
    content += match[2];
    colors.push({ start, end: content.length, color: match[1] });
    cursor = match.index! + match[0].length;
  }

  return { content: content + input.slice(cursor), colors };
}

function renderColoredText(text: string, colors: ColorRange[], offset = 0): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let cursor = 0;

  for (const range of colors) {
    const start = Math.max(0, range.start - offset);
    const end = Math.min(text.length, range.end - offset);
    if (start >= end) continue;

    parts.push(text.slice(cursor, start));
    parts.push(
      <span key={range.start} style={{ color: range.color }}>
        {text.slice(start, end)}
      </span>,
    );
    cursor = end;
  }

  parts.push(text.slice(cursor));
  return parts;
}

export default function ConsoleWindow({
  children,
  text,
  title,
  noCopy,
  backgroundColor = "#000",
  foregroundColor = "#fff",
  titleBackgroundColor = "#121212",
  titleForegroundColor = "#f0f0f0",
  language,
  wrap = "word",
}: ConsoleWindowProps): React.ReactElement {
  const rawContent = text ?? toPlainText(children);
  const { content, colors } = parseConsoleColors(normalizeConsoleText(rawContent));
  let nextLineOffset = 0;
  const lineOffsets = content.split("\n").map((line) => {
    const offset = nextLineOffset;
    nextLineOffset += line.length + 1;
    return offset;
  });

  const prismTheme = prismThemes.vsDark;

  const style = {
    "--consolewin-bg": backgroundColor,
    "--consolewin-fg": foregroundColor,
    "--consolewin-title-bg": titleBackgroundColor,
    "--consolewin-title-fg": titleForegroundColor,
    "--consolewin-nocopy": noCopy == "true" ? "none" : "text",
  } as React.CSSProperties;

  return (
    <section className={styles.window} style={style}>
      {title ? (
        <header className={styles.titleBar}>
          <span className={styles.title}>{title}</span>
        </header>
      ) : null}

      {language ? (
        <Highlight
          code={content}
          language={language as Language}
          theme={prismTheme}
        >
          {({ tokens, getLineProps, getTokenProps }) => (
            <pre className={styles.console} data-wrap={wrap}>
              {tokens.map((line, i) => {
                let tokenOffset = lineOffsets[i];
                return (
                  <div key={i} {...getLineProps({ line })}>
                    {line.map((token, key) => {
                      const offset = tokenOffset;
                      tokenOffset += token.empty ? 0 : token.content.length;
                      return (
                        <span key={key} {...getTokenProps({ token })}>
                          {renderColoredText(token.content, colors, offset)}
                        </span>
                      );
                    })}
                  </div>
                );
              })}
            </pre>
          )}
        </Highlight>
      ) : (
        <pre className={styles.console} data-wrap={wrap}>
          <code>{renderColoredText(content, colors)}</code>
        </pre>
      )}
    </section>
  );
}
