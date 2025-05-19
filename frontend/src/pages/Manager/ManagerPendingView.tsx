
import React, { ReactNode, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Header from '../../layouts/header/header';
import { CardContent } from '@mui/material';
import CustomerApiService from '../../data/services/Reports/CustomerEdit/customeredit-api-service';
import { CustomerEditData } from '../../data/services/Reports/CustomerEdit/customeredit-payload';
import { useNavigate, useParams } from 'react-router-dom';

interface CustomerPayload {
    fromDate: string;
    toDate: string;
    name: string;
    count: string;
    userName: string;
    created_at: string;
    pepName: string;
    dob: string;
    panNum: string;
    sourceLink: string;
    pepId: number;
    uid: number;
}

function ManagerPendingView() {
    const { pepId } = useParams<{ pepId: string }>();
    const calculateWeekRange = (date: Date): [Date, Date] => {
        const currentDate = new Date(date);
        const dayOfWeek = currentDate.getDay();
        const startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - dayOfWeek);
        const endDate = new Date(currentDate);
        endDate.setDate(currentDate.getDate() + (6 - dayOfWeek));
        return [startDate, endDate];
    };

    const [selectedOption, setSelectedOption] = useState<string>('daily');
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [highlightedWeek, setHighlightedWeek] = useState(calculateWeekRange(new Date()));
    const customerApiService = new CustomerApiService();
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [data, setData] = useState<CustomerPayload[]>([]);
    const [searchInput, setSearchInput] = useState<string>('');

    const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOption(event.target.value);
        setCurrentDate(new Date());
        setStartDate(new Date());
        setEndDate(new Date());
    };

    const formatDate = (date: Date): string => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    function convert(str: string | number | Date) {
        const date = new Date(str);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }


    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(event.target.value);
    };

    const handleNameInputKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            // Trigger search on "Enter" key press
            handleSearch();
        }
    };

    const handleSearch = () => {
        const formattedStartDate = convert(startDate);
        const formattedEndDate = convert(endDate);
        const startDateAsDate = new Date(formattedStartDate);
        const endDateAsDate = new Date(formattedEndDate);

        customerApiService
            .getManagerPending(startDateAsDate, endDateAsDate)
            .then((fetchedData: CustomerEditData[]) => {
                setSearchPerformed(true);
                const transformedData: CustomerPayload[] = fetchedData.map((entry) => {
                    return {
                        fromDate: entry.frmDate,
                        toDate: entry.toDate,
                        name: entry.name,
                        count: entry.count,
                        userName: entry.userName,
                        created_at: entry.created_at,
                        pepName: entry.pepName,
                        dob: entry.dob,
                        panNum: entry.panNum,
                        sourceLink: entry.sourceLink,
                        pepId: entry.pepId,
                        uid: entry.uid,
                    };
                });

                const hiddenPepIdsString = localStorage.getItem('hiddenPepIds');
                const hiddenPepIds = hiddenPepIdsString ? JSON.parse(hiddenPepIdsString) : [];
                const filteredData = transformedData.filter(
                    (item) =>
                    !hiddenPepIds.includes(item?.pepId?.toString()) &&
                    (item?.userName?.toLowerCase()?.includes(searchInput.toLowerCase()) ||
                        item?.pepName?.toLowerCase()?.includes(searchInput.toLowerCase()) ||
                        item?.panNum?.toLowerCase()?.includes(searchInput.toLowerCase()) ||
                        (item.created_at && formatDate(new Date(item.created_at)).includes(searchInput.toLowerCase())) ||
                        item?.sourceLink?.toLowerCase()?.includes(searchInput.toLowerCase()))
                    
                );

                setData(filteredData);
                localStorage.setItem('customerData', JSON.stringify(filteredData));
            })
            .catch((error) => {
                console.error('API request error:', error);
            });
    };

    const handleStartChange = (date: Date) => {
        let newStartDate = new Date(date);
        if (selectedOption === 'weekly') {
            const [weekStart, weekEnd] = calculateWeekRange(newStartDate);
            setHighlightedWeek([weekStart, weekEnd]);
        } else if (selectedOption === 'monthly') {
            const firstDayOfMonth = new Date(newStartDate.getFullYear(), newStartDate.getMonth(), 1);
            const lastDayOfMonth = new Date(newStartDate.getFullYear(), newStartDate.getMonth() + 1, 0);
            setHighlightedWeek([firstDayOfMonth, lastDayOfMonth]);
        }
        setCurrentDate(newStartDate);
        setStartDate(newStartDate);
    };

    const handleEndChange = (date: Date) => {
        let newEndDate = new Date(date);

        if (selectedOption === 'weekly') {
            const [weekStart, weekEnd] = calculateWeekRange(newEndDate);
            setHighlightedWeek([weekStart, weekEnd]);
        } else if (selectedOption === 'monthly') {
            const firstDayOfMonth = new Date(newEndDate.getFullYear(), newEndDate.getMonth(), 1);
            const lastDayOfMonth = new Date(newEndDate.getFullYear(), newEndDate.getMonth() + 1, 0);
            setHighlightedWeek([firstDayOfMonth, lastDayOfMonth]);
        }
        setEndDate(newEndDate);
    };

    const getDisabledDates = (): [Date | null, Date | null] => {
        const today = new Date();
        let minDate: Date | null = new Date(today);
        let maxDate: Date | null = new Date(today);

        return [minDate, maxDate];
    };

    const disabledDates = getDisabledDates();
    const navigate = useNavigate();

    // const handleTableRowClick = (uid: string, pepId: string) => {
    //     navigate(`/view/${pepId}/${uid}`);
    // };

    useEffect(() => {
        const hiddenPepIdsString = localStorage.getItem('hiddenPepIds');
        const hiddenPepIds = hiddenPepIdsString ? JSON.parse(hiddenPepIdsString) : [];
        const storedData = localStorage.getItem('customerData');
        if (storedData) {
            const transformedData = JSON.parse(storedData) as CustomerPayload[];
            const filteredData = transformedData.filter(
                (item) =>
                    item.pepId.toString() !== pepId &&
                    !hiddenPepIds.includes(item.pepId.toString())
            );
            setData(filteredData);
        }
    }, [pepId]);

    return (
        <>
            <h4 style={{ marginTop: '6%', marginLeft: '2%' }}>Manager Pending Veiw</h4>
            <Header />
            <Card border='10px' style={{ margin: '2%' }}>
                <Container className="alertreport-container">
                    <CardContent>
                        <Form>
                            <Row>
                                <Col xs={4}>
                                    <Form.Group>
                                        <Row>
                                            <Col>
                                                <Form.Label>Start Date:</Form.Label>
                                                <DatePicker
                                                    selected={startDate}
                                                    onChange={handleStartChange}
                                                    dateFormat="MMMM d, yyyy"
                                                    className="form-control"
                                                    disabledKeyboardNavigation
                                                    minDate={selectedOption === 'custom' ? null : new Date(1900, 0, 1)}
                                                    maxDate={selectedOption === 'custom' ? null : new Date(2100, 11, 31)}
                                                    highlightDates={highlightedWeek}
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Label>End Date:</Form.Label>
                                                <DatePicker
                                                    selected={endDate}
                                                    onChange={handleEndChange}
                                                    dateFormat="MMMM d, yyyy"
                                                    className="form-control"
                                                    disabledKeyboardNavigation
                                                    minDate={selectedOption === 'custom' ? null : new Date(1900, 0, 1)}
                                                    maxDate={selectedOption === 'custom' ? null : new Date(2100, 11, 31)}
                                                    highlightDates={highlightedWeek}
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                </Col>
                                <Col xs={4}>
                                 
                                    <Button variant="primary" style={{ marginTop: '8%' }} onClick={handleSearch}>
                                        Apply Dates
                                    </Button>
                                    </Col>
                                    <Col>
                                    <Form.Group>
                                        <Form.Label>Search:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Search  name"
                                            value={searchInput}
                                            onChange={handleSearchInputChange}  
                                            onKeyPress={handleNameInputKeyPress}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                        <div className="current-date"></div>
                        {data.length === 0 && searchPerformed && (
                            <p>No data available</p>
                        )}
                        {data.length > 0 && (
                            <table className="table report-table" >
                                <thead>
                                    <tr>
                                        <th>Sl no</th>
                                        <th>Pep Name</th>
                                        <th>DOB</th>
                                        <th>PAN No</th>
                                        {/* <th>Source Link</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item: CustomerPayload, index: number) => (
                                        <tr
                                            key={index}
                                            // onClick={() =>
                                            //     handleTableRowClick(
                                            //         String(item.uid),
                                            //         String(item.pepId)
                                            //     )
                                            // }
                                        >
                                            <td>{index + 1}</td>
                                            {/* <td>{item.userName}</td> */}
                                            {/* <td>{formatDate(new Date(item.created_at))}</td> */}
                                            <td>{item.pepName}</td>
                                            <td>{item.dob}</td>
                                            <td>{item.panNum}</td>
                                            {/* <td>
                                                <a
                                                    href={item.sourceLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {item.sourceLink}
                                                </a>
                                            </td> */}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </CardContent>
                </Container>
            </Card>
        </>
    );
}

export default ManagerPendingView;