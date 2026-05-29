"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

function Sheet({ ...props }: React.ComponentProps<typeof Dialog.Root>) {
  return <Dialog.Root {...props} />;
}

function SheetTrigger({ ...props }: React.ComponentProps<typeof Dialog.Trigger>) {
  return <Dialog.Trigger {...props} />;
}

function SheetPortal({ ...props }: React.ComponentProps<typeof Dialog.Portal>) {
  return <Dialog.Portal {...props} />;
}

function SheetClose({ ...props }: React.ComponentProps<typeof Dialog.Close>) {
  return <Dialog.Close {...props} />;
}

function SheetOverlay({ className, ...props }: React.ComponentProps<typeof Dialog.Overlay>) {
  return (
    <Dialog.Overlay
      className={cn("fixed inset-0 z-50 bg-black/50 backdrop-blur-sm", className)}
      {...props}
    />
  );
}

function SheetContent({ className, children, ...props }: React.ComponentProps<typeof Dialog.Content>) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <Dialog.Content
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-zinc-200 bg-white p-6 shadow-lg",
          className,
        )}
        {...props}
      >
        {children}
        <SheetClose className="absolute right-4 top-4 rounded-sm text-zinc-500 transition-opacity hover:text-zinc-900">
          <X className="h-4 w-4" />
          <span className="sr-only">Chiudi</span>
        </SheetClose>
      </Dialog.Content>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-2 text-left", className)} {...props} />;
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof Dialog.Title>) {
  return <Dialog.Title className={cn("text-lg font-semibold", className)} {...props} />;
}

function SheetDescription({ className, ...props }: React.ComponentProps<typeof Dialog.Description>) {
  return <Dialog.Description className={cn("text-sm text-zinc-500", className)} {...props} />;
}

export {
  Sheet,
  SheetTrigger,
  SheetPortal,
  SheetClose,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
};
