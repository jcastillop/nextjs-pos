import { ReactElement, useState } from 'react';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  code: string;
}

type Props = {
  children: ReactElement[]
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export const BasicTabs: React.FC<Props> = ({ children }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          {children.map((item, index) => (
            <Tab label={item.props.title} {...a11yProps(index)} key={index} disabled={item.props["data-disabled"]? true: false}/>
          ))}
        </Tabs>
      </Box>
      {children.map((item, index) => (
        <CustomTabPanel value={value} index={index} code={item.props["data-code"]} key={index}>
          {children[index]}
        </CustomTabPanel>
      ))}
      {/* <CustomTabPanel value={value} index={1} code={''}>
        Item Two
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2} code={''}>
        Item Three
      </CustomTabPanel> */}
    </Box>
  );
}