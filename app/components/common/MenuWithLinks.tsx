import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Router, { NextRouter, withRouter } from 'next/router';
import React, { useState, memo } from 'react';

type Props = {
  options: any[];
  router: NextRouter;
  children: React.ReactNode;
};
const MenuWithLinks = (props: Props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { options, router, children } = props;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div
        aria-controls={anchorEl ? 'simple-menu' : null}
        aria-haspopup="true"
        onClick={handleClick}
        onKeyPress={handleClick}
      >
        {children}
      </div>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {options.map((option, i) =>
          option.separator ? (
            <hr style={{ width: '85%', margin: '10px auto' }} key={`separated-${i}`} />
          ) : (
            <MenuItem
              onClick={() => {
                if (option.externalServer) {
                  window.location.href = option.href;
                } else {
                  Router.push(option.href, option.as || option.href);
                }
                handleClose();
              }}
              key={option.href}
              style={{
                fontWeight: router.asPath.includes(option.highlighterSlug) ? 600 : 300,
                fontSize: '14px',
              }}
            >
              {option.text}
            </MenuItem>
          ),
        )}
      </Menu>
    </div>
  );
};

export default memo(withRouter(MenuWithLinks));
