// 'use client';

// import { memo, useState, useMemo, useCallback } from 'react';
// import {
//   useReactTable,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   flexRender,
//   createColumnHelper,
//   OnChangeFn,
//   SortingState,
//   ColumnFiltersState,
// } from '@tanstack/react-table';
// import { Skeleton } from '@/components/ui/skeleton';
// import { Card, CardContent } from '@/components/ui/card';
// import { ArrowUpDown, ArrowUp, ArrowDown, Users, Phone, UserCheck } from 'lucide-react';

// const columnHelper = createColumnHelper<Lead>();

// const MOCK_LEADS: Lead[] = [
//   {
//     id: 'lead-01',
//     name: 'Nguyen Van A',
//     phone: '0901234567',
//     score: LeadScore.Hot,
//     assignedTo: { id: 'u-01', name: 'Tran Minh Khang' },
//   } as Lead,
//   {
//     id: 'lead-02',
//     name: 'Le Thi B',
//     phone: '0912345678',
//     score: LeadScore.Warm,
//     assignedTo: { id: 'u-02', name: 'Pham Bao Chau' },
//   } as Lead,
//   {
//     id: 'lead-03',
//     name: 'Do Van C',
//     phone: '',
//     score: LeadScore.Cold,
//     assignedTo: null,
//   } as Lead,
// ];

// interface DataTableProps {
//   data: Lead[];
//   isLoading?: boolean;
//   totalCount: number;
//   currentPage: number;
//   pageSize: number;
//   totalPages: number;
//   onPageChange?: (page: number) => void;
//   onPageSizeChange?: (pageSize: number) => void;
// }

// const ScoreBadge = memo(({ score }: { score: LeadScore }) => {
//   const getScoreConfig = (score: LeadScore) => {
//     switch (score) {
//       case LeadScore.Hot:
//         return {
//           label: 'Ưu tiên cao',
//           description: 'Khách hàng sẵn sàng mua, cần liên hệ trong 24h',
//           priority: 'Khẩn cấp',
//         };
//       case LeadScore.Warm:
//         return {
//           label: 'Ưu tiên trung bình',
//           description: 'Khách hàng quan tâm, cần theo dõi và nuôi dưỡng',
//           priority: 'Bình thường',
//         };
//       case LeadScore.Cold:
//         return {
//           label: 'Ưu tiên thấp',
//           description: 'Khách hàng tiềm năng, cần chiến lược dài hạn',
//           priority: 'Thấp',
//         };
//     }
//   };

//   const config = getScoreConfig(score);

//   return (
//     <div className="flex items-center gap-2">
//       <span
//         className={`text-xs font-medium px-2 py-1 rounded-full ${
//           score === LeadScore.Hot
//             ? 'bg-red-100 text-red-800'
//             : score === LeadScore.Warm
//               ? 'bg-yellow-100 text-yellow-800'
//               : 'bg-blue-100 text-blue-800'
//         }`}
//       >
//         {config.label}
//       </span>
//     </div>
//   );
// });

// ScoreBadge.displayName = 'ScoreBadge';

// const AssignedUsers = memo(({ assigned }: { assigned: Lead['assignedTo'] }) => {
//   if (!assigned) {
//     return (
//       <div className="flex items-center gap-2 text-muted-foreground">
//         <UserCheck className="h-4 w-4" />
//         <span className="text-sm">Chưa giao</span>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col gap-1">
//       <div className="text-sm">
//         <span className="font-medium">{assigned.name}</span>
//       </div>
//     </div>
//   );
// });

// AssignedUsers.displayName = 'AssignedUsers';

// function DataTableSkeleton() {
//   return (
//     <div className="w-full space-y-6 p-6">
//       <div className="flex flex-col space-y-4">
//         <div className="flex justify-between items-center">
//           <Skeleton className="h-8 w-64" />
//           <Skeleton className="h-4 w-32" />
//         </div>
//         <div className="relative max-w-sm">
//           <Skeleton className="h-10 w-full" />
//         </div>
//       </div>

//       <Card className="border-0 shadow-sm bg-white/50 backdrop-blur-sm">
//         <CardContent className="p-0">
//           <div className="bg-muted/30 px-6 py-4">
//             <div className="flex space-x-8">
//               {Array.from({ length: 8 }).map((_, i) => (
//                 <Skeleton key={i} className="h-4 w-20" />
//               ))}
//             </div>
//           </div>

//           <div className="divide-y divide-border/50">
//             {Array.from({ length: 5 }).map((_, i) => (
//               <div key={i} className="px-6 py-4">
//                 <div className="flex space-x-8">
//                   <Skeleton className="h-4 w-12" />
//                   <Skeleton className="h-4 w-32" />
//                   <Skeleton className="h-4 w-40" />
//                   <Skeleton className="h-4 w-32" />
//                   <Skeleton className="h-4 w-48" />
//                   <Skeleton className="h-4 w-20" />
//                   <Skeleton className="h-4 w-24" />
//                   <Skeleton className="h-4 w-32" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>

//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-4">
//           <Skeleton className="h-4 w-48" />
//           <div className="flex items-center space-x-2">
//             <Skeleton className="h-4 w-24" />
//             <Skeleton className="h-8 w-[70px]" />
//           </div>
//         </div>

//         <div className="flex items-center space-x-2">
//           {Array.from({ length: 5 }).map((_, i) => (
//             <Skeleton key={i} className="h-8 w-8" />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// function DataTableEmpty() {
//   return (
//     <div className="w-full p-6">
//       <Card className="border-0 shadow-sm bg-white/50 backdrop-blur-sm">
//         <CardContent className="flex flex-col items-center justify-center py-16">
//           <div className="text-center space-y-3">
//             <Users className="h-16 w-16 text-muted-foreground mx-auto" />
//             <h3 className="text-xl font-semibold text-foreground">Không có dữ liệu</h3>
//             <p className="text-sm text-muted-foreground max-w-md">Chưa có leads nào để hiển thị.</p>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// export const DataTable = memo(
//   ({ data, isLoading = false, currentPage, pageSize, totalPages }: DataTableProps) => {
//     const effectiveData = data && data.length > 0 ? data : MOCK_LEADS;
//     const [sorting, setSorting] = useState<SortingState>([]);
//     const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
//     const [globalFilter, setGlobalFilter] = useState('');

//     const columns = useMemo(
//       () => [
//         columnHelper.accessor('name', {
//           header: 'Tên khách hàng',
//           cell: info => (
//             <div className="flex items-center gap-2">
//               <Users className="h-4 w-4 text-muted-foreground" />
//               <span className="font-medium">{info.getValue()}</span>
//             </div>
//           ),
//         }),
//         columnHelper.accessor('phone', {
//           header: 'Số điện thoại',
//           cell: info => (
//             <div className="flex items-center gap-2">
//               <Phone className="h-4 w-4 text-muted-foreground" />
//               <span className="text-sm font-mono">
//                 {info.getValue() || 'Không có số điện thoại'}
//               </span>
//             </div>
//           ),
//         }),
//         columnHelper.accessor('score', {
//           header: 'Điểm đánh giá',
//           cell: info => <ScoreBadge score={info.getValue()} />,
//         }),
//         columnHelper.accessor('assignedTo', {
//           header: 'Người được giao',
//           cell: info => <AssignedUsers assigned={info.getValue()} />,
//         }),
//       ],
//       []
//     );

//     const table = useReactTable<Lead>({
//       data: effectiveData,
//       columns,
//       getCoreRowModel: getCoreRowModel(),
//       getFilteredRowModel: getFilteredRowModel(),
//       getPaginationRowModel: getPaginationRowModel(),
//       getSortedRowModel: getSortedRowModel(),
//       onSortingChange: setSorting as OnChangeFn<SortingState>,
//       onColumnFiltersChange: setColumnFilters as OnChangeFn<ColumnFiltersState>,
//       onGlobalFilterChange: setGlobalFilter as OnChangeFn<string>,
//       state: {
//         sorting,
//         columnFilters,
//         globalFilter,
//       },
//       initialState: {
//         pagination: {
//           pageSize: pageSize,
//           pageIndex: currentPage - 1,
//         },
//       },
//       manualPagination: true,
//       pageCount: totalPages,
//     });

//     const getSortIcon = useCallback(
//       (column: { getCanSort: () => boolean; getIsSorted: () => false | 'asc' | 'desc' }) => {
//         if (!column.getCanSort()) return null;

//         const sorted = column.getIsSorted();
//         if (sorted === 'asc') return <ArrowUp className="ml-2 h-4 w-4" />;
//         if (sorted === 'desc') return <ArrowDown className="ml-2 h-4 w-4" />;
//         return <ArrowUpDown className="ml-2 h-4 w-4" />;
//       },
//       []
//     );

//     if (isLoading) {
//       return <DataTableSkeleton />;
//     }

//     return (
//       <div className="w-full space-y-4 sm:space-y-6">
//         <Card className="border-2 shadow-sm bg-white/50 backdrop-blur-sm">
//           <CardContent className="p-0">
//             <div className="overflow-x-auto">
//               <table className="min-w-[720px] md:min-w-full divide-y divide-border/50">
//                 <thead className="bg-muted/30">
//                   {table.getHeaderGroups().map(headerGroup => (
//                     <tr key={headerGroup.id}>
//                       {headerGroup.headers.map(header => (
//                         <th
//                           key={header.id}
//                           className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
//                         >
//                           {header.isPlaceholder ? null : (
//                             <div
//                               className={
//                                 header.column.getCanSort()
//                                   ? 'flex items-center cursor-pointer select-none hover:text-foreground transition-colors'
//                                   : 'flex items-center'
//                               }
//                               onClick={header.column.getToggleSortingHandler()}
//                             >
//                               {flexRender(header.column.columnDef.header, header.getContext())}
//                               {getSortIcon(header.column)}
//                             </div>
//                           )}
//                         </th>
//                       ))}
//                     </tr>
//                   ))}
//                 </thead>
//                 <tbody className="bg-white/50 divide-y divide-border/50">
//                   {table.getRowModel().rows?.length ? (
//                     table.getRowModel().rows.map(row => (
//                       <tr key={row.id} className="hover:bg-muted/20 transition-colors">
//                         {row.getVisibleCells().map(cell => (
//                           <td key={cell.id} className="px-4 sm:px-6 py-3 sm:py-4">
//                             {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                           </td>
//                         ))}
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td
//                         colSpan={columns.length}
//                         className="px-4 sm:px-6 py-6 sm:py-8 text-center text-muted-foreground"
//                       >
//                         Không tìm thấy kết quả.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }
// );

// DataTable.displayName = 'DataTable';
