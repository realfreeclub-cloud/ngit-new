
import React, { useRef } from "react";
import { Rnd } from "react-rnd";
import { EditorElement, PageConfig } from "./useEditorState";

interface EditorCanvasProps {
    elements: EditorElement[];
    pageConfig: PageConfig;
    zoom: number;
    selectedIds: string[];
    onSelect: (id: string, multi: boolean) => void;
    onUpdate: (id: string, updates: Partial<EditorElement>) => void;
    onCommit: () => void; // Called on drag/resize stop
    backgroundImage: string;
    showGrid: boolean;
    showMargins: boolean;
}

export default function EditorCanvas({
    elements,
    pageConfig,
    zoom,
    selectedIds,
    onSelect,
    onUpdate,
    onCommit,
    backgroundImage,
    showGrid,
    showMargins
}: EditorCanvasProps) {
    const canvasRef = useRef<HTMLDivElement>(null);

    // Click outside to deselect
    const handleCanvasClick = (e: React.MouseEvent) => {
        if (e.target === canvasRef.current) {
            onSelect("", false);
        }
    };

    return (
        <div
            className="flex-1 bg-slate-200 overflow-auto flex items-center justify-center p-10 relative"
            onClick={handleCanvasClick}
        >
            <div
                ref={canvasRef}
                className="bg-white shadow-2xl relative transition-transform origin-center"
                style={{
                    width: pageConfig.width,
                    height: pageConfig.height,
                    transform: `scale(${zoom})`,
                    backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Grid Overlay */}
                {showGrid && (
                    <div
                        className="absolute inset-0 pointer-events-none opacity-10"
                        style={{
                            backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                            backgroundSize: '40px 40px'
                        }}
                    />
                )}

                {/* Print Margins (Safety Area) - e.g. 5mm approx 14px */}
                {showMargins && (
                    <div className="absolute inset-4 border border-dashed border-red-300 pointer-events-none opacity-50 z-50">
                        <span className="absolute top-0 left-0 text-[8px] text-red-400 px-1 bg-white">Safe Area</span>
                    </div>
                )}

                {elements.map((el, index) => {
                    if (el.hidden) return null;
                    const isSelected = selectedIds.includes(el.id);

                    return (
                        <Rnd
                            key={el.id}
                            size={{ width: el.width || 'auto', height: el.height || 'auto' }}
                            position={{ x: el.x, y: el.y }}
                            onDrag={(e, d) => {
                                // Real-time update for smoothness
                                onUpdate(el.id, { x: d.x, y: d.y });
                            }}
                            onDragStop={(e, d) => {
                                onUpdate(el.id, { x: d.x, y: d.y });
                                onCommit();
                            }}
                            onResizeStop={(e, dir, ref, delta, pos) => {
                                onUpdate(el.id, {
                                    width: parseInt(ref.style.width),
                                    height: parseInt(ref.style.height),
                                    ...pos
                                });
                                onCommit();
                            }}
                            disableDragging={el.locked}
                            enableResizing={!el.locked}
                            bounds="parent"
                            className={`
                                group
                                ${isSelected ? 'outline outline-2 outline-primary z-50' : 'hover:outline hover:outline-1 hover:outline-slate-300'}
                            `}
                            style={{ 
                                zIndex: isSelected ? 50 : index + 1
                            }}
                            onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                onSelect(el.id, e.shiftKey);
                            }}
                        >
                            <div
                                className="w-full h-full flex overflow-hidden items-center"
                                style={{
                                    transform: `rotate(${el.rotation || 0}deg)`,
                                    opacity: el.opacity,
                                    // Style props
                                    fontFamily: el.style?.fontFamily,
                                    fontSize: el.style?.fontSize ? `${el.style.fontSize}px` : undefined,
                                    fontWeight: el.style?.fontWeight as any,
                                    color: el.style?.color,
                                    textAlign: el.style?.textAlign as any,
                                    letterSpacing: el.style?.letterSpacing ? `${el.style.letterSpacing}px` : undefined,
                                    lineHeight: el.style?.lineHeight,
                                    justifyContent: el.style?.textAlign === 'center' ? 'center' : (el.style?.textAlign === 'right' ? 'flex-end' : 'flex-start'),
                                    borderRadius: el.style?.borderRadius ? `${el.style.borderRadius}px` : undefined,
                                    boxShadow: el.style?.boxShadow,
                                }}
                            >
                                {el.type === 'text' && (
                                    <div className="w-full h-full whitespace-pre-wrap select-none">{el.content}</div>
                                )}
                                {el.type === 'image' && (
                                    <img
                                        src={el.content?.startsWith('{{') ? 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngwing.com%2Fen%2Ffree-png-zppre&psig=AOvVaw0_9_f0_9_f0_9_f0_9&ust=1711036800000000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCJjJ_vj_9YQDFQAAAAAdAAAAABAE' : el.content}
                                        alt="element"
                                        className="w-full h-full pointer-events-none"
                                        style={{ objectFit: el.style?.objectFit || 'contain' }}
                                    />
                                )}
                                {el.type === 'qrcode' && (
                                    <div className="w-full h-full bg-black/5 flex items-center justify-center border-2 border-dashed border-slate-300">
                                        <span className="text-[10px] text-slate-400">QR Code</span>
                                    </div>
                                )}
                            </div>

                            {/* Rotate Handle (Custom) */}
                            {isSelected && !el.locked && (
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border border-slate-300 rounded-full cursor-grab flex items-center justify-center shadow-sm">
                                    <div className="w-1 h-1 bg-slate-400 rounded-full" />
                                </div>
                            )}
                        </Rnd>
                    );
                })}
            </div>
        </div>
    );
}
