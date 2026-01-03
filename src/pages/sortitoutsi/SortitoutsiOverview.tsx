import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ExternalLink,
    Loader2,
    Search,
    AlertCircle,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Nation {
    id: string;
    name: string;
    nickname: string;
    logo: string;
    newgens: string;
    isWomens: boolean;
    detailUrl: string;
}

type SortField = "name" | "nickname" | "newgens" | "type";
type SortOrder = "asc" | "desc" | null;

export default function SortItOutSIOverview() {
    const [nations, setNations] = useState<Nation[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [genderFilter, setGenderFilter] = useState<"all" | "mens" | "womens">("all");
    const [sortField, setSortField] = useState<SortField | null>(null);
    const [sortOrder, setSortOrder] = useState<SortOrder>(null);
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const result = await window.electronAPI.fetchSortItOutSINations();
            
            if (result.success) {
                setNations(result.data);
            } else {
                setError(result.error || "Failed to fetch data");
            }
        } catch (err) {
            setError("An unexpected error occurred");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchData();
    }, []);
    
    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, genderFilter, pageSize]);
    
    const handleSort = (field: SortField) => {
        if (sortField === field) {
            if (sortOrder === "asc") {
                setSortOrder("desc");
            } else if (sortOrder === "desc") {
                setSortOrder(null);
                setSortField(null);
            }
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };
    
    const getSortIcon = (field: SortField) => {
        if (sortField !== field) {
            return <ArrowUpDown className="h-4 w-4 ml-1" />;
        }
        if (sortOrder === "asc") {
            return <ArrowUp className="h-4 w-4 ml-1" />;
        }
        if (sortOrder === "desc") {
            return <ArrowDown className="h-4 w-4 ml-1" />;
        }
        return <ArrowUpDown className="h-4 w-4 ml-1" />;
    };
    
    const newgensOrder = ["Excellent", "Good", "Average", "Basic", "Poor"];
    
    const sortedAndFilteredNations = nations
        .filter((nation) => {
            const matchesSearch = nation.name.toLowerCase().includes(searchQuery.toLowerCase());
            
            if (genderFilter === "all") return matchesSearch;
            if (genderFilter === "mens") return matchesSearch && !nation.isWomens;
            if (genderFilter === "womens") return matchesSearch && nation.isWomens;
            
            return matchesSearch;
        })
        .sort((a, b) => {
            if (!sortField || !sortOrder) return 0;
            
            let comparison = 0;
            
            switch (sortField) {
                case "name":
                    comparison = a.name.localeCompare(b.name);
                    break;
                case "nickname":
                    comparison = (a.nickname || "").localeCompare(b.nickname || "");
                    break;
                case "newgens": {
                    const aIndex = newgensOrder.indexOf(a.newgens);
                    const bIndex = newgensOrder.indexOf(b.newgens);
                    comparison = aIndex - bIndex;
                    break;
                }
                case "type":
                    comparison = (a.isWomens === b.isWomens) ? 0 : a.isWomens ? 1 : -1;
                    break;
            }
            
            return sortOrder === "asc" ? comparison : -comparison;
        });
        
    // Pagination calculations
    const totalItems = sortedAndFilteredNations.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedNations = sortedAndFilteredNations.slice(startIndex, endIndex);
    
    const mensCount = nations.filter(n => !n.isWomens).length;
    const womensCount = nations.filter(n => n.isWomens).length;
    
    const getNewgensColor = (newgens: string) => {
        switch (newgens.toLowerCase()) {
        case "excellent":
            return "bg-green-500";
        case "good":
            return "bg-blue-500";
        case "average":
            return "bg-yellow-500";
        case "basic":
            return "bg-orange-500";
        case "poor":
            return "bg-red-500";
        default:
            return "bg-gray-500";
        }
    };
    
    const openUrl = (url: string) => {
        window.electronAPI.openExternal(url);
    };
    
    return (
        <div className="space-y-5">
            {error && (
                <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            
            {loading ? (
                <Card>
                    <CardContent className="flex items-center justify-center p-10">
                        <div className="flex flex-col items-center gap-2.5">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Loading nations...</p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Tabs
                    value={genderFilter}
                    onValueChange={(v) => setGenderFilter(v as "all" | "mens" | "womens")}
                    className="gap-5"
                >
                    {/* Toolbar */}
                    <div className="flex items-center justify-between gap-5">
                        {/* Search */}
                        <div className="relative w-full">
                            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search nations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8.5"
                            />
                        </div>
                        
                        {/* Filter Tabs */}
                        <TabsList className="shrink-0">
                            <TabsTrigger value="all">All ({nations.length})</TabsTrigger>
                            <TabsTrigger value="mens">Mens ({mensCount})
                            </TabsTrigger><TabsTrigger value="womens">Womens ({womensCount})</TabsTrigger>
                        </TabsList>
                    </div>
                    
                    {/* Content */}
                    <TabsContent
                        value={genderFilter}
                        className="space-y-5"
                    >
                        <div className="overflow-hidden rounded-md border">
                            <Table>
                                {/* Header */}
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-15">Flag</TableHead>
                                        <TableHead>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 px-2 lg:px-3"
                                                onClick={() => handleSort("name")}
                                            >
                                                Nation
                                                {getSortIcon("name")}
                                            </Button>
                                        </TableHead>
                                        <TableHead>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 px-2 lg:px-3"
                                                onClick={() => handleSort("nickname")}
                                            >
                                                Nickname
                                                {getSortIcon("nickname")}
                                            </Button>
                                        </TableHead>
                                        <TableHead className="w-30">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 px-2 lg:px-3"
                                                onClick={() => handleSort("newgens")}
                                            >
                                                Newgens
                                                {getSortIcon("newgens")}
                                            </Button>
                                        </TableHead>
                                        <TableHead className="w-25">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 px-2 lg:px-3"
                                                onClick={() => handleSort("type")}
                                            >
                                                Type
                                                {getSortIcon("type")}
                                            </Button>
                                        </TableHead>
                                        <TableHead className="w-20"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                
                                {/* Body */}
                                <TableBody>
                                    {paginatedNations.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center text-muted-foreground">
                                                {nations.length === 0 ? "No data loaded. Click refresh to load nations." : "No nations found"}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        paginatedNations.map((nation) => (
                                            <TableRow key={nation.id + (nation.isWomens ? "-w" : "-m")}>
                                                <TableCell>
                                                    <img
                                                        src={nation.logo}
                                                        alt={nation.name}
                                                        className="w-8.75 h-6.25 object-contain"
                                                        onError={(e) => {
                                                            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='35' height='25'%3E%3Crect width='35' height='25' fill='%23ddd'/%3E%3C/svg%3E";
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{nation.name}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm text-muted-foreground">
                                                        {nation.nickname || "-"}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="secondary"
                                                        className={`${getNewgensColor(nation.newgens)}`}
                                                    >
                                                        {nation.newgens}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={nation.isWomens ? "default" : "outline"}>
                                                        {nation.isWomens ? "Womens" : "Mens"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => openUrl(nation.detailUrl)}
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        
                        {/* Pagination Controls */}
                        <div className="flex items-center justify-between">
                            {/* Rows Per Page */}
                            <div className="flex items-center gap-2">
                                <p className="text-sm text-muted-foreground">Rows per page</p>
                                <Select
                                    value={pageSize.toString()}
                                    onValueChange={(value) => setPageSize(Number(value))}
                                >
                                    <SelectTrigger className="h-8 w-17.5">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="20">20</SelectItem>
                                        <SelectItem value="30">30</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                        <SelectItem value="100">100</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            {/* Showing Results */}
                            <div className="flex items-center gap-2">
                                <p className="text-sm text-muted-foreground">
                                    {totalItems === 0 ? (
                                        "No results"
                                    ) : (
                                        <>
                                        Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} results
                                        </>
                                    )}
                                </p>
                            </div>
                            
                            {/* Previous or Next */}
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(1)}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronsLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <div className="flex items-center gap-1">
                                    <p className="text-sm font-medium">
                                        Page {currentPage} of {totalPages || 1}
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(totalPages)}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                >
                                    <ChevronsRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            )}
        </div>
    );
}
