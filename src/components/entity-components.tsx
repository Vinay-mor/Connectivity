import {
  AlertTriangleIcon,
  Loader2Icon,
  MoreVerticalIcon,
  PackageOpenIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Input } from "./ui/input";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";
import React from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type EntityHeaderProps = {
  title: string;
  description?: string;
  newButtonLabel?: string;
  disabled?: boolean;
  isCreating?: boolean;
} & (
  | { onNew: () => void; newButtonHref?: never }
  | { newButtonHref: string; onNew?: never }
  | { onNew?: never; newButtonHref?: never }
);

export const EntityHeader = ({
  title,
  description,
  onNew,
  newButtonLabel,
  newButtonHref,
  disabled,
  isCreating,
}: EntityHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
      <div className="flex flex-col gap-0.5">
        <h1 className="font-display text-xl md:text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        {description && (
          <p className="text-xs md:text-sm text-muted-foreground font-normal">
            {description}
          </p>
        )}
      </div>
      {onNew && !newButtonHref && (
        <Button
          disabled={isCreating || disabled}
          size="sm"
          onClick={onNew}
          className="h-10 rounded-xl px-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-semibold shadow-md shadow-cyan-500/20 gap-2 transition-all hover:opacity-90 active:scale-95"
        >
          <PlusIcon className="size-4" />
          {newButtonLabel}
        </Button>
      )}
      {newButtonHref && !onNew && (
        <Button
          size="sm"
          asChild
          className="h-10 rounded-xl px-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-semibold shadow-md shadow-cyan-500/20 gap-2 transition-all hover:opacity-90 active:scale-95"
        >
          <Link prefetch href={newButtonHref}>
            <PlusIcon className="size-4" />
            {newButtonLabel}
          </Link>
        </Button>
      )}
    </div>
  );
};

type EntityContainerProps = {
  children: React.ReactNode;
  header?: React.ReactNode;
  search?: React.ReactNode;
  pagination?: React.ReactNode;
};

export const EntityContainer = ({
  children,
  header,
  search,
  pagination,
}: EntityContainerProps) => {
  return (
    <div className="p-4 md:px-8 md:py-6 h-full min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto max-w-screen-xl w-full flex flex-col gap-y-6 h-full">
        {header}

        <div className="flex flex-col gap-y-4 h-full">
          {search}
          {children}
          {pagination}
        </div>
      </div>
    </div>
  );
};

interface EntitySearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const EntitySearch = ({
  value,
  onChange,
  placeholder = "Search items...",
}: EntitySearchProps) => {
  return (
    <div className="relative w-full sm:w-72 sm:ml-auto">
      <SearchIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <Input
        className="h-10 w-full rounded-xl bg-card/60 backdrop-blur-sm border-border/80 pl-9 pr-4 text-xs font-medium focus:border-primary focus:ring-primary/20 shadow-sm"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

interface EntityPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export const EntityPagination = ({
  page,
  totalPages,
  onPageChange,
  disabled,
}: EntityPaginationProps) => {
  return (
    <div className="flex items-center justify-between gap-x-2 w-full pt-4 border-t border-border/40">
      <div className="text-xs font-mono text-muted-foreground">
        Page <span className="text-foreground font-semibold">{page}</span> of{" "}
        <span className="text-foreground font-semibold">{totalPages || 1}</span>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          disabled={page === 1 || disabled}
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          className="h-8 rounded-lg text-xs"
        >
          Previous
        </Button>
        <Button
          disabled={page === totalPages || totalPages === 0 || disabled}
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          className="h-8 rounded-lg text-xs"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

interface StateViewProps {
  message?: string;
}

export const LoadingView = ({ message }: StateViewProps) => {
  return (
    <div className="flex justify-center items-center h-64 flex-1 flex-col gap-y-3">
      <Loader2Icon className="size-7 animate-spin text-primary" />
      {!!message && (
        <p className="text-xs font-mono text-muted-foreground animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

export const ErrorView = ({ message }: StateViewProps) => {
  return (
    <div className="flex justify-center items-center h-64 flex-1 flex-col gap-y-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
      <AlertTriangleIcon className="size-7 text-destructive" />
      {!!message && (
        <p className="text-xs font-medium text-destructive">{message}</p>
      )}
    </div>
  );
};

interface EmptyViewProps extends StateViewProps {
  onNew?: () => void;
}

export const EmptyView = ({ message, onNew }: EmptyViewProps) => {
  return (
    <Empty className="border border-dashed border-border/80 bg-card/40 backdrop-blur-sm rounded-2xl p-8">
      <EmptyHeader>
        <EmptyMedia variant="icon" className="bg-primary/10 text-primary p-3 rounded-2xl">
          <PackageOpenIcon className="size-6" />
        </EmptyMedia>
      </EmptyHeader>
      <EmptyTitle className="font-display font-bold text-lg">
        No items found
      </EmptyTitle>
      {!!message && (
        <EmptyDescription className="text-xs text-muted-foreground max-w-sm">
          {message}
        </EmptyDescription>
      )}
      {!!onNew && (
        <EmptyContent>
          <Button
            onClick={onNew}
            className="rounded-xl bg-primary text-primary-foreground font-medium text-xs px-4"
          >
            Add item
          </Button>
        </EmptyContent>
      )}
    </Empty>
  );
};

interface EntityListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  getKey?: (item: T, index: number) => string | number;
  emptyView?: React.ReactNode;
  className?: string;
}

export function EntityList<T>({
  items,
  renderItem,
  getKey,
  emptyView,
  className,
}: EntityListProps<T>) {
  if (items.length === 0 && emptyView) {
    return (
      <div className="flex-1 flex justify-center items-center py-12">
        <div className="max-w-sm w-full mx-auto">{emptyView}</div>
      </div>
    );
  }
  return (
    <div className={cn("flex flex-col gap-y-3", className)}>
      {items.map((item, index) => (
        <div key={getKey ? getKey(item, index) : index}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}

interface EntityItemProps {
  href: string;
  title: string;
  subtitle?: React.ReactNode;
  image?: React.ReactNode;
  actions?: React.ReactNode;
  onRemove?: () => void | Promise<void>;
  isRemoving?: boolean;
  className?: string;
}

export const EntityItem = ({
  href,
  title,
  subtitle,
  image,
  actions,
  onRemove,
  isRemoving,
  className,
}: EntityItemProps) => {
  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isRemoving) {
      return;
    }
    if (onRemove) {
      await onRemove();
    }
  };

  return (
    <Link href={href} prefetch>
      <Card
        className={cn(
          "p-4 rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm shadow-sm hover:border-primary/40 hover:shadow-md interactive-row cursor-pointer transition-all duration-200",
          isRemoving && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <CardContent className="flex flex-row items-center justify-between p-0">
          <div className="flex items-center gap-3.5">
            {image && (
              <div className="flex size-10 items-center justify-center rounded-xl bg-accent/60 text-accent-foreground border border-border/40">
                {image}
              </div>
            )}
            <div>
              <CardTitle className="text-base font-semibold text-foreground tracking-tight group-hover:text-primary transition-colors">
                {title}
              </CardTitle>
              {!!subtitle && (
                <CardDescription className="text-xs text-muted-foreground mt-0.5 font-normal">
                  {subtitle}
                </CardDescription>
              )}
            </div>
          </div>
          {(actions || onRemove) && (
            <div className="flex gap-x-3 items-center">
              {actions}
              {onRemove && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8 rounded-lg hover:bg-accent/80 text-muted-foreground hover:text-foreground"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVerticalIcon className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="rounded-xl border border-border/80 bg-popover/90 backdrop-blur-md"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenuItem
                      onClick={handleRemove}
                      className="text-destructive focus:text-destructive focus:bg-destructive/10 rounded-lg text-xs gap-2"
                    >
                      <TrashIcon className="size-3.5" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};